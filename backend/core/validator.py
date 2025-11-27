import ast
from typing import Tuple, List
from backend.core.limitations import FORBIDDEN_IMPORTS, FORBIDDEN_BUILTINS

class SecurityVisitor(ast.NodeVisitor):
    def __init__(self):
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            if alias.name.split('.')[0] in FORBIDDEN_IMPORTS:
                self.errors.append(f"Importing '{alias.name}' is forbidden.")
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module and node.module.split('.')[0] in FORBIDDEN_IMPORTS:
            self.errors.append(f"Importing from '{node.module}' is forbidden.")
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            if node.func.id in FORBIDDEN_BUILTINS:
                self.errors.append(f"Calling '{node.func.id}' is forbidden.")
        self.generic_visit(node)

def validate_code(code: str) -> Tuple[bool, List[str]]:
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, [f"Syntax Error: {e}"]

    visitor = SecurityVisitor()
    visitor.visit(tree)
    
    if visitor.errors:
        return False, visitor.errors
    
    return True, []
