import sys
import subprocess
import time
import tempfile
import os
from backend.models.run_response import ExecutionResult

def execute_code(code: str, timeout: int = 5, memory_limit_mb: int = 100) -> ExecutionResult:
    start_time = time.time()
    
    # Create a temporary file for the user code
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        # We wrap the user code to restrict builtins and set memory limits
        wrapper_code = f"""
import sys
import resource
import traceback

def set_memory_limit(max_mem_mb):
    if sys.platform.startswith('linux'):
        try:
            soft, hard = resource.getrlimit(resource.RLIMIT_AS)
            resource.setrlimit(resource.RLIMIT_AS, (max_mem_mb * 1024 * 1024, hard))
        except Exception:
            pass # Ignore if we can't set limits (e.g. not on Linux or permission issues)

def restrict_builtins():
    import builtins
    forbidden = ['open', 'eval', 'exec', 'help', 'input']
    for name in forbidden:
        if hasattr(builtins, name):
            try:
                delattr(builtins, name)
            except AttributeError:
                pass

if __name__ == "__main__":
    set_memory_limit({memory_limit_mb})
    # Save exec before restricting builtins
    safe_exec = exec
    restrict_builtins()
    
    # Execute user code
    try:
        user_code = {repr(code)}
        safe_exec(user_code, {{'__name__': '__main__'}})
    except Exception:
        # Print exception to stderr so we can capture it
        traceback.print_exc()
        sys.exit(1)
"""
        temp_file.write(wrapper_code)
        temp_file_path = temp_file.name

    try:
        process = subprocess.run(
            [sys.executable, temp_file_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        output = process.stdout
        stack_trace = process.stderr if process.returncode != 0 else None
        exit_code = process.returncode
        status = "success" if exit_code == 0 else "error"
        
        error_msg = None
        if stack_trace:
            lines = stack_trace.strip().split('\\n')
            if lines:
                error_msg = lines[-1]

    except subprocess.TimeoutExpired:
        status = "timeout"
        output = ""
        error_msg = "Execution timed out"
        stack_trace = None
        exit_code = 124
    except Exception as e:
        status = "error"
        output = ""
        error_msg = str(e)
        stack_trace = str(e)
        exit_code = 1
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

    execution_time = time.time() - start_time
    
    return ExecutionResult(
        status=status,
        output=output,
        error=error_msg,
        stack_trace=stack_trace,
        execution_time=execution_time,
        exit_code=exit_code
    )
