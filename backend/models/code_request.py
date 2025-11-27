from pydantic import BaseModel

class RunCodeRequest(BaseModel):
    code: str
    language: str = "python"
    timeout: int = 5
    memory_limit_mb: int = 100