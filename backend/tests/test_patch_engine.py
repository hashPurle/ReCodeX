from backend.engine.patch_generator import generate_patch
from backend.core.parser import ParsedError

def test_zero_division_patch():
    code = "print(10 / 0)"
    error = ParsedError(type="ZeroDivisionError", message="division by zero", line_number=1)
    patch = generate_patch(code, error)
    assert "if" in patch.fixed_code

def test_recursion_error_patch():
    code = "def f(n):\n    return f(n-1)"
    error = ParsedError(type="RecursionError", message="maximum recursion depth exceeded", line_number=2)
    patch = generate_patch(code, error)
    assert "if" in patch.fixed_code
