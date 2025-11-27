import sys
import os
import asyncio

# --- FIX: Add the parent directory ('backend') to Python's path ---
# This makes sure we can find 'core' and 'engine'
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
# ------------------------------------------------------------------

from core.parser import extract_error_context
from engine.patch_generator import generate_patch

async def run_test():
    print("--- 1. Testing Parser ---")
    raw_error = """
    Traceback (most recent call last):
      File "test.py", line 10, in <module>
        main()
      File "test.py", line 5, in main
        print(1/0)
    ZeroDivisionError: division by zero
    """
    clean_error = extract_error_context(raw_error)
    print(f"Original Lines: {len(raw_error.splitlines())}")
    print(f"Cleaned Lines:  {len(clean_error.splitlines())}")
    print(f"Last Line:      {clean_error.splitlines()[-1]}")

    print("\n--- 2. Testing Patch Generator (Mock) ---")
    broken_code = "a = 10\nb = 0\nprint(a / b)"
    
    # Call the async function
    fixed_code = await generate_patch(broken_code, clean_error)
    
    print("Result Code:")
    print(fixed_code)

if __name__ == "__main__":
    asyncio.run(run_test())