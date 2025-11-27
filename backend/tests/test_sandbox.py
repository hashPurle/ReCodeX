from backend.core.sandbox import execute_code

def test_successful_execution():
    result = execute_code("print('hello')")
    assert result.status == "success"
    assert result.output.strip() == "hello"

def test_timeout_enforcement():
    result = execute_code("import time; time.sleep(2)", timeout=1)
    assert result.status == "timeout"

def test_error_capture():
    result = execute_code("1/0")
    assert result.status == "error"
    assert "ZeroDivisionError" in (result.error or "")
