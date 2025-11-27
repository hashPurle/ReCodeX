from pydantic import BaseModel
from typing import List, Optional
from .run_response import ExecutionResult
from .patch_request import PatchResponse

class RepairRequest(BaseModel):
    code: str
    max_iterations: int = 3
    timeout: int = 5

class RepairIteration(BaseModel):
    iteration: int
    code: str
    execution: ExecutionResult
    patch: Optional[PatchResponse] = None

class RepairResponse(BaseModel):
    status: str
    iterations: List[RepairIteration]
    final_code: str
    repaired: bool
    total_iterations: int
