def extract_error_context(stderr: str) -> str:
    """
    Extracts the last few lines of a stack trace to find the actual error.
    """
    if not stderr:
        return "Unknown Error"
    
    lines = stderr.strip().split('\n')
    
    # Grab the last 3 lines to get context + the error message
    # If the error is short, take the whole thing
    return "\n".join(lines[-3:]) if len(lines) > 3 else stderr