from backend.core.sandbox import execute_code
from backend.core.parser import parse_error
from backend.engine.patch_generator import generate_patch
from backend.models.repair_response import RepairResponse, RepairIteration

def repair_code(code: str, max_iterations: int = 3, timeout: int = 5) -> RepairResponse:
    iterations = []
    current_code = code
    repaired = False
    
    for i in range(max_iterations):
        iteration_num = i + 1
        
        # 1. Execute
        result = execute_code(current_code, timeout=timeout)
        
        iteration_data = RepairIteration(
            iteration=iteration_num,
            code=current_code,
            execution=result,
            patch=None
        )
        
        if result.status == "success":
            repaired = True
            iterations.append(iteration_data)
            break
            
        # 2. Parse Error
        parsed_err = parse_error(result.stack_trace or result.error)
        
        # 3. Generate Patch
        patch_response = generate_patch(current_code, parsed_err)
        iteration_data.patch = patch_response
        iterations.append(iteration_data)
        
        if patch_response.confidence == 0.0:
            # Cannot fix
            break
            
        # 4. Apply Patch
        # We use fixed_code from the patch response for reliability
        current_code = patch_response.fixed_code
        
    return RepairResponse(
        status="success",
        iterations=iterations,
        final_code=current_code,
        repaired=repaired,
        total_iterations=len(iterations)
    )
