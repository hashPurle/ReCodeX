from fastapi import APIRouter
from backend.models.code_request import RunCodeRequest
from backend.models.run_response import ExecutionResult
from backend.core.sandbox import execute_code
from backend.core.validator import validate_code
from backend.utils.logger import logger

router = APIRouter()

@router.post("/run", response_model=ExecutionResult)
def run_code_endpoint(request: RunCodeRequest):
    logger.info("Received run request")

    is_valid, errors = validate_code(request.code)
    if not is_valid:
        return ExecutionResult(
            status="error",
            output="",
            error="Validation Error: " + "; ".join(errors),
            stack_trace=None,
            execution_time=0.0,
            exit_code=1
        )

    result = execute_code(
        request.code,
        request.timeout,
        request.memory_limit_mb
    )

    return result
