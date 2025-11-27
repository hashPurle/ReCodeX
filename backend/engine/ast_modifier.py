import ast
import ast
from typing import Optional

class ASTModifier:
    """
    Helper class to perform AST-based code modifications.
    """
    
    @staticmethod
    def add_import(code: str, module_name: str) -> str:
        """
        Adds an import statement at the top of the file if not present.
        """
        tree = ast.parse(code)
        
        # Check if already imported
        for node in tree.body:
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name == module_name:
                        return code
            elif isinstance(node, ast.ImportFrom):
                if node.module == module_name:
                    return code

        # Add import
        return f"import {module_name}\n" + code

    @staticmethod
    def wrap_in_try_except(code: str, line_no: int, exception_type: str = "Exception") -> str:
        """
        Wraps a specific line in a try-except block.
        Note: This is a simplified string manipulation based on line number.
        True AST manipulation for this is complex because we need to preserve formatting/comments.
        """
        lines = code.splitlines()
        if line_no < 1 or line_no > len(lines):
            return code
            
        idx = line_no - 1
        target_line = lines[idx]
        indent = len(target_line) - len(target_line.lstrip())
        indent_str = " " * indent
        
        # We can't easily wrap just one line if it's part of a block without parsing structure.
        # But for a simple "fix", we can try.
        
        new_lines = [
            f"{indent_str}try:",
            f"    {target_line.lstrip()}",
            f"{indent_str}except {exception_type}:",
            f"{indent_str}    pass  # Handle error"
        ]
        
        lines[idx] = "\n".join(new_lines)
        return "\n".join(lines)

    @staticmethod
    def insert_statement(code: str, line_no: int, statement: str) -> str:
        """
        Inserts a statement before the given line number.
        """
        lines = code.splitlines()
        if line_no < 1 or line_no > len(lines) + 1:
            return code
            
        idx = line_no - 1
        
        # Determine indentation from the target line
        if idx < len(lines):
            target_line = lines[idx]
            indent = len(target_line) - len(target_line.lstrip())
            indent_str = " " * indent
        else:
            indent_str = ""
            
        lines.insert(idx, f"{indent_str}{statement}")
        return "\n".join(lines)