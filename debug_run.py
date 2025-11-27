import sys
import os

# Add current directory to sys.path
sys.path.append(os.getcwd())

from backend.core.sandbox import execute_code

try:
    print("Running execute_code...")
    result = execute_code("print(2 + 3)")
    print("Result:", result)
except Exception as e:
    print("Crashed:", e)
    import traceback
    traceback.print_exc()
