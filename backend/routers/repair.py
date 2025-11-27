from fastapi import APIRouter
from backend.models.repair_response import RepairRequest, RepairResponse
from backend.engine.repair_loop import repair_code
from backend.utils.logger import logger

router = APIRouter()

@router.post("/repair", response_model=RepairResponse)
def repair_code_endpoint(request: RepairRequest):
    logger.info("Received repair request")
    
    result = repair_code(request.code, request.max_iterations, request.timeout)
    
    logger.info(f"Repair finished. Repaired: {result.repaired}, Iterations: {result.total_iterations}")
    return result