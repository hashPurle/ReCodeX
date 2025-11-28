from fastapi import APIRouter, HTTPException
from backend.models.patch_request import PatchRequest, PatchResponse
from backend.core.parser import extract_error_context
from backend.engine.patch_generator import generate_patch
from backend.utils.logger import logger

router = APIRouter()


@router.post("/patch", response_model=PatchResponse)
async def generate_patch_endpoint(request: PatchRequest):
    logger.info("Received patch request")
    
    parsed_err = extract_error_context(request.stack_trace or request.error)
    logger.info(f"Parsed error context: {parsed_err.splitlines()[-1] if parsed_err else 'unknown'}")

    patch_response = await generate_patch(request.code, parsed_err)
    logger.info(f"Generated patch with confidence: {getattr(patch_response, 'confidence', 0)}")

    # normalize to PatchResponse model
    patch_obj = {
        'patch': patch_response.get('patch') if isinstance(patch_response, dict) else patch_response,
        'reasoning': patch_response.get('response') if isinstance(patch_response, dict) else '',
        'fixed_code': patch_response.get('patch') if isinstance(patch_response, dict) else patch_response,
        'confidence': patch_response.get('confidence', 0.0) if isinstance(patch_response, dict) else 0.0,
    }

    return patch_obj