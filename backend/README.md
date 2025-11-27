# Local AI-Supervised Autonomous Debugging Sandbox - Backend

This is the backend implementation for the ReCodeX debugging sandbox.

## Setup

1.  **Install Python 3.10+**
2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Start the FastAPI server:
```bash
uvicorn backend.main:app --reload --port 8000
```
**Note:** Run this command from the `ReCodeX` root directory (the parent of the `backend` folder).

The API will be available at `http://localhost:8000`.
Interactive API docs are available at `http://localhost:8000/docs`.

## Testing

### Automated Tests
Run the test suite using `pytest`:
```bash
# Ensure you are in the ReCodeX root directory
export PYTHONPATH=$PYTHONPATH:$(pwd)
pytest backend/tests/
```

### Manual Testing (Postman)

You can use Postman to test the API endpoints.

**Collection Setup:**
1.  Create a new Collection named "ReCodeX".
2.  Set a variable `base_url` to `http://localhost:8000`.

**1. Test `/run` Endpoint**
*   **Method:** POST
*   **URL:** `{{base_url}}/run`
*   **Body (JSON):**
    ```json
    {
      "code": "print(2 + 3)",
      "timeout": 5
    }
    ```
*   **Expected Response:** Status 200, `status: "success"`, `output: "5\n"`.
*   **Test Error Case:**
    ```json
    {
      "code": "import os; os.system('ls')",
      "timeout": 5
    }
    ```
    *   **Expected Response:** Status 200, `status: "error"`, `error: "Validation Error: ..."` (due to forbidden import).

**2. Test `/patch` Endpoint**
*   **Method:** POST
*   **URL:** `{{base_url}}/patch`
*   **Body (JSON):**
    ```json
    {
      "code": "print(10 / 0)",
      "error": "ZeroDivisionError: division by zero",
      "stack_trace": "Traceback (most recent call last):\n  File \"<string>\", line 1, in <module>\nZeroDivisionError: division by zero"
    }
    ```
*   **Expected Response:** Status 200, `patch` field containing the diff.

**3. Test `/repair` Endpoint**
*   **Method:** POST
*   **URL:** `{{base_url}}/repair`
*   **Body (JSON):**
    ```json
    {
      "code": "def factorial(n):\n    return n * factorial(n-1)\nprint(factorial(5))",
      "max_iterations": 3
    }
    ```
*   **Expected Response:** Status 200, `repaired: true`, `final_code` containing the fix.

### Manual Testing (cURL)

**1. Execute Code (`/run`):**
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(2 + 3)",
    "timeout": 5
  }'
```

**2. Generate Patch (`/patch`):**
```bash
curl -X POST http://localhost:8000/patch \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(10 / 0)",
    "error": "ZeroDivisionError: division by zero",
    "stack_trace": "Traceback (most recent call last):\\n  File \\"<string>\\", line 1, in <module>\\nZeroDivisionError: division by zero"
  }'
```

**3. Full Repair Loop (`/repair`):**
```bash
curl -X POST http://localhost:8000/repair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def factorial(n):\\n    return n * factorial(n-1)\\nprint(factorial(5))",
    "max_iterations": 3
  }'
```
