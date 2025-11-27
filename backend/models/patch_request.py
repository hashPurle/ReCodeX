from pydantic import BaseModel

class PatchRequest(BaseModel):
    code: str
    error: str
    stack_trace: str
    output: str = ""

class PatchResponse(BaseModel):
    patch: str
    reasoning: str
    fixed_code: str
    confidence: float
