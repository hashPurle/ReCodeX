# backend/routers/repair.py

from fastapi import APIRouter, HTTPException
from backend.models.repair_response import RepairRequest, RepairResponse
from backend.engine.repair_loop import repair_code
from backend.utils.logger import logger

router = APIRouter()


@router.post("/repair", response_model=RepairResponse)
def repair_code_endpoint(request: RepairRequest):

    logger.info(
        f"[API] Received repair request | "
        f"Code length: {len(request.code)} | "
        f"Max iterations: {request.max_iterations} | "
        f"Timeout: {request.timeout}s"
    )

    try:
        result = repair_code(
            request.code,
            max_iterations=request.max_iterations,
            timeout=request.timeout
        )

        # Basic safety check: ensure we always return the expected shape
        if result is None:
            logger.error("⚠️ repair_code() returned None — forcing failure response.")
            raise HTTPException(status_code=500, detail="Repair engine returned an empty result.")

        logger.info(
            f"[API] Repair finished | "
            f"Status={'SUCCESS' if result.repaired else 'FAILED'} | "
            f"Iterations={result.total_iterations}"
        )

        return result

    except Exception as e:
        logger.exception(f"[API] Unhandled exception during repair: {str(e)}")

        # Always return a valid model so frontend never crashes
        return RepairResponse(
            repaired=False,
            total_iterations=0,
            final_code=request.code,
            history=[],
            error=str(e)
        )
