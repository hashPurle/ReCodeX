from pydantic import BaseModel
from typing import Optional

class ExecutionResult(BaseModel):
    status: str  # "success" | "error" | "timeout"
    output: str
    error: Optional[str] = None
    stack_trace: Optional[str] = None
    execution_time: float
    exit_code: int