import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.engine.repair_loop import start_repair_session


app = FastAPI(title="DevForge Autonomous Debugger")

# --- CORS (Allow your Frontend to talk to this Backend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathons, allow everything. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Model ---
class RepairRequest(BaseModel):
    code: str
    max_iterations: int = 3

# --- Endpoints ---

@app.get("/")
def health_check():
    """Simple check to see if server is running"""
    return {"status": "online", "system": "ReCodeX Engine"}

@app.post("/repair")
async def run_autonomous_repair(request: RepairRequest):
    """
    Main Endpoint: Receives broken code, returns fixed code + logs.
    """
    print(f"--> [API] Received repair request for code length: {len(request.code)}")
    
    if not request.code:
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    try:
        # Calls your "Step 3" Logic
        result = await start_repair_session(request.code, request.max_iterations)
        return result
    except Exception as e:
        print(f"xx [API Error] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Runs the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)