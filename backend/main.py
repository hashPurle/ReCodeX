from fastapi import FastAPI
from backend.routers import run_code, patch, repair

app = FastAPI(title="ReCodeX Backend", version="1.0.0")

app.include_router(run_code.router)
app.include_router(patch.router)
app.include_router(repair.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": ["/run", "/patch", "/repair"]
    }
