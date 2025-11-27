import sys
import os
import asyncio
import json

# --- FIX PATHS ---
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
# -----------------

from engine.repair_loop import start_repair_session

async def run_test():
    print("=== STARTING AUTONOMOUS REPAIR TEST ===")
    
    # Broken code: Index Error (Accessing item 5 in a list of 3)
    bad_code = """
my_list = [10, 20, 30]
print("The last item is:")
print(my_list[5])
"""

    # Run the loop (limit to 3 tries)
    result = await start_repair_session(bad_code, max_iterations=3)
    
    # Print Summary
    print("\n=== FINAL REPORT ===")
    print(f"Status: {result['status']}")
    print(f"Total Iterations: {result['iterations']}")
    print("-" * 30)
    
    # Show history briefly
    for step in result['history']:
        print(f"Iter {step['iteration']}: Success={step['success']}")
        if not step['success']:
            print(f"   Error: {step['stderr'].splitlines()[-1]}")

if __name__ == "__main__":
    asyncio.run(run_test())