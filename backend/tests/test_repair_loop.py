from backend.engine.repair_loop import repair_code

def test_single_iteration_repair():
    code = "print(x)"  # NameError
    result = repair_code(code, max_iterations=3)
    assert result.repaired == True
    assert result.total_iterations <= 3
    assert "x = 0" in result.final_code

def test_max_iterations_limit():
    code = "syntax error !@#"  # unfixable
    result = repair_code(code, max_iterations=2)
    assert result.repaired == False
    assert result.total_iterations == 2
