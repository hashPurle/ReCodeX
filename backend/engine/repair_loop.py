import asyncio
from core.sandbox import execute_code
from core.parser import extract_error_context
from engine.patch_generator import generate_patch

async def start_repair_session(code: str, max_iterations: int = 3):
    """
    The main loop: Runs code, checks for errors, asks AI for fix, repeats.
    """
    history = []
    current_code = code

    for i in range(1, max_iterations + 1):
        print(f"--- Iteration {i} ---")
        
        # 1. Run the code
        result = execute_code(current_code)
        
        # 2. Save the result to history
        step_log = {
            "iteration": i,
            "code": current_code,
            "stdout": result["stdout"],
            "stderr": result["stderr"],
            "success": result["success"]
        }
        history.append(step_log)

        # 3. Check for Success
        if result["success"]:
            print(">> Success! Code is fixed.")
            return {
                "status": "fixed",
                "final_code": current_code,
                "iterations": i,
                "history": history
            }
        
        # 4. If Failed, Prepare for Next Loop
        # Extract clean error
        clean_error = extract_error_context(result["stderr"])
        
        # Ask AI for new code
        # Note: In a real diff system, we would apply a patch here. 
        # For now, our AI returns the FULL fixed code, so we just update the variable.
        print(f">> Failure detected. Asking AI to fix: {clean_error.splitlines()[-1]}")
        current_code = await generate_patch(current_code, clean_error)

    # If we run out of iterations
    print(">> Max iterations reached. Could not fix.")
    return {
        "status": "failed",
        "final_code": current_code,
        "iterations": max_iterations,
        "history": history
    }