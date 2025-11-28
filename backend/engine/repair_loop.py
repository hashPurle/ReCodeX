import asyncio
from backend.core.sandbox import execute_code
from backend.core.parser import extract_error_context
from backend.engine.patch_generator import generate_patch

async def start_repair_session(code: str, max_iterations: int = 3):
    """
    The main loop: Runs code, checks for errors, asks AI for fix, repeats.
    """
    history = []
    patches = []  # record of patches applied: { iteration, prev, next, ai_reasoning }
    current_code = code

    for i in range(1, max_iterations + 1):
        ai_reasoning = ""
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
                "history": history,
                "patches": patches,
            }
        
        # 4. If Failed, Prepare for Next Loop
        # Extract clean error
        clean_error = extract_error_context(result["stderr"])
        
        # Ask AI for new code
        # Note: In a real diff system, we would apply a patch here. 
        # For now, our AI returns the FULL fixed code, so we just update the variable.
        print(f">> Failure detected. Asking AI to fix: {clean_error.splitlines()[-1]}")
        patch_result = await generate_patch(current_code, clean_error)
        if isinstance(patch_result, dict):
            current_code = patch_result.get('patch', current_code)
            ai_reasoning = {
                'response': patch_result.get('response', ''),
                'prompt': patch_result.get('prompt', ''),
                'confidence': patch_result.get('confidence', 0.0)
            }
        else:
            current_code = patch_result
            ai_reasoning = {'response': '', 'prompt': '', 'confidence': 0.0}
        # attach ai_reasoning to the run step if present
        history[-1]['ai_reasoning'] = ai_reasoning
        # if the AI proposed a change, record the patch from prev to next
        if current_code and history[-1]['code'] != current_code:
            patches.append({
                'iteration': i,
                'prev': history[-1]['code'],
                'next': current_code,
                'ai_reasoning': ai_reasoning,
            })
            print(f"[PATCH] Iter {i}: prev len={len(history[-1]['code'])} next len={len(current_code)}")

    # If we run out of iterations
    print(">> Max iterations reached. Could not fix.")
    return {
        "status": "failed",
        "final_code": current_code,
        "iterations": max_iterations,
        "history": history,
        "patches": patches,
    }