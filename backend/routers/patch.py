from fastapi import APIRouter, HTTPException
from backend.models.patch_request import PatchRequest, PatchResponse
from backend.core.parser import parse_error
from backend.engine.patch_generator import generate_patch
from backend.utils.logger import logger

router = APIRouter()

@router.post("/patch", response_model=PatchResponse)
def generate_patch_endpoint(request: PatchRequest):
    logger.info("Received patch request")
    
    parsed_err = parse_error(request.stack_trace or request.error)
    logger.info(f"Parsed error: {parsed_err.type}")
    
    patch_response = generate_patch(request.code, parsed_err)
    logger.info(f"Generated patch with confidence: {patch_response.confidence}")
    
    return patch_response
