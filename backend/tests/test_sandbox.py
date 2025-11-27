import sys
import os

# --- FIX: Add the parent directory ('backend') to Python's path ---
# This allows us to import from 'core' even though we are inside 'tests'
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
# ------------------------------------------------------------------

from core.sandbox import execute_code

# Test 1: Code that works
print("--- TEST 1: Good Code ---")
good_code = "print('Hello Hackathon')"
result = execute_code(good_code)
print(f"Output: {result['stdout'].strip()}")
print(f"Success: {result['success']}")

# Test 2: Code that crashes (Division by zero)
print("\n--- TEST 2: Broken Code ---")
bad_code = """
a = 10
b = 0
print(a / b)
"""
result = execute_code(bad_code)
print(f"Error: {result['stderr'].strip()}")
print(f"Success: {result['success']}")

# Test 3: Infinite Loop (Should timeout)
print("\n--- TEST 3: Infinite Loop ---")
loop_code = "while True: pass"
result = execute_code(loop_code)
print(f"Error: {result['stderr']}")
print(f"Success: {result['success']}")