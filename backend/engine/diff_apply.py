import re

def apply_diff(original_code: str, diff: str) -> str:
    """
    Apply a unified diff to the original code.
    """
    if not diff:
        return original_code

    original_lines = original_code.splitlines()
    diff_lines = diff.splitlines()
    
    result_lines = []
    src_idx = 0
    
    i = 0
    while i < len(diff_lines):
        line = diff_lines[i]
        
        if line.startswith('---') or line.startswith('+++'):
            i += 1
            continue
            
        if line.startswith('@@'):
            # Parse chunk header: @@ -old_start,old_len +new_start,new_len @@
            match = re.search(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', line)
            if match:
                old_start = int(match.group(1))
                # Adjust to 0-indexed
                target_src_idx = old_start - 1
                
                # Copy lines from src until we reach the chunk start
                while src_idx < target_src_idx and src_idx < len(original_lines):
                    result_lines.append(original_lines[src_idx])
                    src_idx += 1
            i += 1
            continue
            
        if line.startswith(' '):
            # Context line
            if src_idx < len(original_lines):
                result_lines.append(original_lines[src_idx])
                src_idx += 1
        elif line.startswith('-'):
            # Deleted line
            src_idx += 1
        elif line.startswith('+'):
            # Added line
            result_lines.append(line[1:])
        
        i += 1
        
    # Append any remaining lines from original
    while src_idx < len(original_lines):
        result_lines.append(original_lines[src_idx])
        src_idx += 1
        
    return '\n'.join(result_lines)
