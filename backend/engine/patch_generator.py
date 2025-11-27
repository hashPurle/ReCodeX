import difflib
import re
from backend.core.parser import ParsedError
from backend.models.patch_request import PatchResponse

def generate_patch(code: str, parsed_error: ParsedError) -> PatchResponse:
    lines = code.split('\n')
    fixed_lines = lines[:]
    reasoning = "Could not generate a patch."
    confidence = 0.0
    
    line_idx = -1
    if parsed_error.line_number is not None:
        line_idx = parsed_error.line_number - 1 # 0-indexed

    if line_idx >= 0 and line_idx < len(lines):
        line_content = lines[line_idx]
        indent = len(line_content) - len(line_content.lstrip())
        indent_str = " " * indent
        
        if parsed_error.type == "NameError":
            # Message: name 'x' is not defined
            match = re.search(r"name '(.*?)' is not defined", parsed_error.message)
            if match:
                var_name = match.group(1)
                # Insert initialization before the line
                init_line = indent_str + f"{var_name} = 0  # Auto-initialized"
                fixed_lines.insert(line_idx, init_line)
                reasoning = f"Initialized undefined variable '{var_name}' to 0."
                confidence = 0.8

        elif parsed_error.type == "ZeroDivisionError":
            # Try to find divisor
            # Pattern: a / b
            parts = re.split(r'\s+/\s+', line_content)
            if len(parts) > 1:
                # Take the token immediately after /
                # This is a simplification
                divisor_part = parts[1]
                # Extract first identifier or number
                match = re.match(r'([a-zA-Z0-9_]+)', divisor_part)
                if match:
                    divisor = match.group(1)
                    if divisor != '0': # If it's literal 0, we can't really fix it by checking if 0 == 0
                        check_line = indent_str + f"if {divisor} == 0: return 0"
                        fixed_lines.insert(line_idx, check_line)
                        reasoning = f"Added check for zero division by '{divisor}'."
                        confidence = 0.7
                    else:
                        # Literal division by zero? e.g. 1/0
                        # Maybe change 0 to 1?
                        fixed_lines[line_idx] = line_content.replace('/ 0', '/ 1').replace('/0', '/1')
                        reasoning = "Replaced literal division by zero with division by one."
                        confidence = 0.6

        elif parsed_error.type == "RecursionError":
            # Walk back to find function def
            for i in range(line_idx, -1, -1):
                if lines[i].strip().startswith("def "):
                    def_line = lines[i]
                    args_match = re.search(r"def \w+\((.*?)\):", def_line)
                    if args_match:
                        args = args_match.group(1).split(',')
                        if args:
                            first_arg = args[0].strip()
                            # Add base case
                            def_indent = len(def_line) - len(def_line.lstrip())
                            base_case_indent = " " * (def_indent + 4) # Assuming 4 spaces indent
                            base_case = base_case_indent + f"if {first_arg} == 0: return 1"
                            fixed_lines.insert(i + 1, base_case)
                            reasoning = f"Added base case for recursion on '{first_arg}'."
                            confidence = 0.6
                    break
        
        elif parsed_error.type == "IndexError":
            # list index out of range
            # Try to find array access arr[i]
            match = re.search(r'(\w+)\[(.*?)\]', line_content)
            if match:
                arr_name = match.group(1)
                idx_expr = match.group(2)
                # Add check
                check_line = indent_str + f"if {idx_expr} >= len({arr_name}): return None"
                fixed_lines.insert(line_idx, check_line)
                reasoning = f"Added bounds check for '{arr_name}'."
                confidence = 0.6

        elif parsed_error.type == "TypeError":
            # can only concatenate str (not "int") to str
            if "concatenate str" in parsed_error.message:
                # Try to wrap non-strings in str()
                # Very hard to do correctly with regex, but let's try a common case: "..." + x
                # We can try to replace `+ x` with `+ str(x)` if x is a variable
                # Or just `print(x)` -> `print(str(x))`?
                # The example is `print("Number: " + 42)`
                # We can try to find `+ <int>`
                match = re.search(r'\+ (\d+)', line_content)
                if match:
                    num = match.group(1)
                    fixed_lines[line_idx] = line_content.replace(f"+ {num}", f"+ str({num})")
                    reasoning = "Converted integer to string for concatenation."
                    confidence = 0.7

    fixed_code = "\n".join(fixed_lines)
    
    # Generate diff
    diff = difflib.unified_diff(
        lines, 
        fixed_lines, 
        fromfile='original', 
        tofile='fixed', 
        lineterm=''
    )
    patch_text = "\n".join(list(diff))
    
    if fixed_code == code:
        confidence = 0.0
        reasoning = "No fix strategy found for this error."

    return PatchResponse(
        patch=patch_text,
        reasoning=reasoning,
        fixed_code=fixed_code,
        confidence=confidence
    )
