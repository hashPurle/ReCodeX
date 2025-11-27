import subprocess
import os
import uuid
import sys

# Define where we store temp files
TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True)

def execute_code(code: str, timeout: int = 5):
    """
    Saves code to a file, runs it, captures output, and cleans up.
    """
    # 1. Create a unique filename so tests don't clash
    filename = f"run_{uuid.uuid4().hex}.py"
    filepath = os.path.join(TEMP_DIR, filename)

    # 2. Write the user's code to this file
    with open(filepath, "w") as f:
        f.write(code)

    try:
        # 3. Run the code in a subprocess
        # capture_output=True grabs print() statements and errors
        # text=True ensures we get Strings back, not Bytes
        result = subprocess.run(
            [sys.executable, filepath],  # run with the same python interpreter
            capture_output=True,
            text=True,
            timeout=timeout  # Stop infinite loops
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.returncode
        }

    except subprocess.TimeoutExpired:
        # Handle infinite loops
        return {
            "success": False,
            "stdout": "",
            "stderr": "Execution Timed Out (Possible Infinite Loop)",
            "exit_code": -1
        }
    
    except Exception as e:
        # Handle system errors
        return {
            "success": False,
            "stdout": "",
            "stderr": str(e),
            "exit_code": -1
        }
    
    finally:
        # 4. Cleanup: Always delete the file, even if it crashed
        if os.path.exists(filepath):
            os.remove(filepath)