from backend.models.run_response import ExecutionResult

def format_execution_result(result: ExecutionResult) -> str:
    output = f"Status: {result.status}\n"
    output += f"Exit Code: {result.exit_code}\n"
    output += f"Time: {result.execution_time:.4f}s\n"
    output += "-" * 20 + "\n"
    if result.output:
        output += f"Output:\n{result.output}\n"
    if result.error:
        output += f"Error:\n{result.error}\n"
    return output
