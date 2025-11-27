import re
from pydantic import BaseModel
from typing import Optional

class ParsedError(BaseModel):
    type: str
    message: str
    line_number: Optional[int] = None
    file: Optional[str] = None
    category: str = "runtime"

def parse_error(stack_trace: str) -> ParsedError:
    if not stack_trace:
        return ParsedError(type="Unknown", message="No stack trace provided")

    lines = stack_trace.strip().split('\n')
    last_line = lines[-1]
    
    # Parse ErrorType: Message
    if ':' in last_line:
        parts = last_line.split(':', 1)
        error_type = parts[0].strip()
        error_message = parts[1].strip()
    else:
        error_type = "UnknownError"
        error_message = last_line

    # Find line number
    # Pattern: File "<string>", line 3, in <module>
    line_number = None
    file_name = None
    
    # Iterate backwards to find the location
    for line in reversed(lines):
        match = re.search(r'File "(.*?)", line (\d+)', line)
        if match:
            file_name = match.group(1)
            line_number = int(match.group(2))
            # If we found the user code (often <string> in exec), break.
            if file_name == "<string>":
                break
    
    category = "runtime"
    if error_type in ["SyntaxError", "IndentationError"]:
        category = "syntax"
    
    return ParsedError(
        type=error_type,
        message=error_message,
        line_number=line_number,
        file=file_name,
        category=category
    )
