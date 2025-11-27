import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Core engine imports
from backend.engine.repair_loop import start_repair_session
from backend.core.sandbox import execute_code
from backend.core.validator import validate_code
from backend.engine.patch_generator import generate_patch




# ----------------------------------------------------------------------------
#   FASTAPI APP
# ----------------------------------------------------------------------------
app = FastAPI(title="ReCodeX Engine", version="1.0.0")

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------------------------------
#   MODELS
# ----------------------------------------------------------------------------
class RunRequest(BaseModel):
    code: str
    timeout: float = 5.0
    memory_limit_mb: int = 128


class PatchRequest(BaseModel):
    code: str
    error: str


class RepairRequest(BaseModel):
    code: str
    max_iterations: int = 3


# ----------------------------------------------------------------------------
#   HEALTH
# ----------------------------------------------------------------------------
@app.get("/")
def health_check():
    return {"status": "online", "system": "ReCodeX Engine"}


# ----------------------------------------------------------------------------
#   RUN ENDPOINT — (Frontend → runCode())
# ----------------------------------------------------------------------------
@app.post("/run")
def run_code_endpoint(req: RunRequest):
    print(f"[+] /run called (len={len(req.code)})")

    if not req.code:
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    # validate syntax before running
    is_valid, errors = validate_code(req.code)
    if not is_valid:
        return {
            "status": "error",
            "output": "",
            "error": "Validation Error: " + "; ".join(errors),
        }

    # safely execute
    result = execute_code(
        req.code,
        timeout=req.timeout,
        memory_limit_mb=req.memory_limit_mb
    )

    return result


# ----------------------------------------------------------------------------
#   PATCH ENDPOINT — (Frontend → generatePatch())
# ----------------------------------------------------------------------------
@app.post("/patch")
async def create_patch_endpoint(req: PatchRequest):
    print("[+] /patch called")

    if not req.code:
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    # generate improved code using LLM
    new_code = await generate_patch(req.code, req.error)

    return {"patch": new_code}


# ----------------------------------------------------------------------------
#   REPAIR ENDPOINT — (Frontend → startRepair())
# ----------------------------------------------------------------------------
@app.post("/repair")
async def autonomous_repair(req: RepairRequest):
    print(f"[+] /repair called (len={len(req.code)})")

    if not req.code:
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    try:
        result = await start_repair_session(
            req.code,
            max_iterations=req.max_iterations
        )
        return result

    except Exception as e:
        print(f"[ERROR] Repair failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------------------------------------------------------
#   MAIN
# ----------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
