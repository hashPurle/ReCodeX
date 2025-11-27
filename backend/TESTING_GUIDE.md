# ReCodeX Backend API Testing Guide

## Table of Contents
1. [Setup](#setup)
2. [Testing with Postman](#testing-with-postman)
3. [Testing with cURL](#testing-with-curl)
4. [Expected Responses](#expected-responses)
5. [Test Cases](#test-cases)

---

## Setup

### Prerequisites
- Python 3.10+
- Virtual environment activated
- Dependencies installed (`pip install -r requirements.txt`)
- Server running on `http://localhost:8000`

### Start the Server
```bash
cd /home/shaggy/Public/ReCodeX
uvicorn backend.main:app --reload --port 8000
```

---

## Testing with Postman

### Import Collection
1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `backend/ReCodeX_Postman_Collection.json`
4. The collection will be imported with all test cases

### Collection Structure
The collection includes 12 pre-configured requests:
- **Health Check**: Verify server is running
- **Run Code**: 4 test cases (success, error, validation, timeout)
- **Generate Patch**: 3 test cases (ZeroDivisionError, NameError, IndexError)
- **Repair**: 4 test cases (NameError, RecursionError, Off-by-One, TypeError)

### Environment Variables
- `base_url`: `http://localhost:8000` (pre-configured)

---

## Testing with cURL

### 1. Health Check
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "endpoints": ["/run", "/patch", "/repair"]
}
```

---

### 2. POST `/run` - Execute Code

#### Test Case 1: Successful Execution
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(2 + 3)",
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "output": "5\n",
  "error": null,
  "stack_trace": null,
  "execution_time": 0.03,
  "exit_code": 0
}
```

#### Test Case 2: Runtime Error (Division by Zero)
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(10 / 0)",
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "error",
  "output": "",
  "error": "ZeroDivisionError: division by zero",
  "stack_trace": "Traceback (most recent call last):\n  ...",
  "execution_time": 0.02,
  "exit_code": 1
}
```

#### Test Case 3: Validation Error (Forbidden Import)
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import os\nos.system(\"ls\")",
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "error",
  "output": "",
  "error": "Validation Error: Importing 'os' is forbidden.",
  "stack_trace": null,
  "execution_time": 0.0,
  "exit_code": 1
}
```

#### Test Case 4: Timeout
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import time\ntime.sleep(10)",
    "timeout": 2
  }'
```

**Expected Response:**
```json
{
  "status": "timeout",
  "output": "",
  "error": "Execution timed out",
  "stack_trace": null,
  "execution_time": 2.0,
  "exit_code": 124
}
```

---

### 3. POST `/patch` - Generate Patch

#### Test Case 1: ZeroDivisionError
```bash
curl -X POST http://localhost:8000/patch \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(10 / 0)",
    "error": "ZeroDivisionError: division by zero",
    "stack_trace": "Traceback (most recent call last):\n  File \"<string>\", line 1, in <module>\nZeroDivisionError: division by zero"
  }'
```

**Expected Response:**
```json
{
  "patch": "--- original\n+++ fixed\n@@ -1 +1 @@\n-print(10 / 0)\n+print(10 / 1)",
  "reasoning": "Replaced literal division by zero with division by one.",
  "fixed_code": "print(10 / 1)",
  "confidence": 0.6
}
```

#### Test Case 2: NameError
```bash
curl -X POST http://localhost:8000/patch \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(x)",
    "error": "NameError: name '\''x'\'' is not defined",
    "stack_trace": "Traceback (most recent call last):\n  File \"<string>\", line 1, in <module>\nNameError: name '\''x'\'' is not defined"
  }'
```

**Expected Response:**
```json
{
  "patch": "--- original\n+++ fixed\n@@ -1 +1,2 @@\n+x = 0  # Auto-initialized\n print(x)",
  "reasoning": "Initialized undefined variable 'x' to 0.",
  "fixed_code": "x = 0  # Auto-initialized\nprint(x)",
  "confidence": 0.8
}
```

#### Test Case 3: IndexError
```bash
curl -X POST http://localhost:8000/patch \
  -H "Content-Type: application/json" \
  -d '{
    "code": "arr = [1, 2, 3]\nprint(arr[5])",
    "error": "IndexError: list index out of range",
    "stack_trace": "Traceback (most recent call last):\n  File \"<string>\", line 2, in <module>\nIndexError: list index out of range"
  }'
```

**Expected Response:**
```json
{
  "patch": "...",
  "reasoning": "Added bounds check for 'arr'.",
  "fixed_code": "arr = [1, 2, 3]\nif 5 >= len(arr): return None\nprint(arr[5])",
  "confidence": 0.6
}
```

---

### 4. POST `/repair` - Autonomous Repair Loop

#### Test Case 1: NameError (1 iteration)
```bash
curl -X POST http://localhost:8000/repair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(x)",
    "max_iterations": 3,
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "iterations": [
    {
      "iteration": 1,
      "code": "print(x)",
      "execution": {
        "status": "error",
        "error": "NameError: name 'x' is not defined",
        ...
      },
      "patch": {
        "reasoning": "Initialized undefined variable 'x' to 0.",
        "confidence": 0.8,
        ...
      }
    },
    {
      "iteration": 2,
      "code": "x = 0  # Auto-initialized\nprint(x)",
      "execution": {
        "status": "success",
        "output": "0\n",
        ...
      },
      "patch": null
    }
  ],
  "final_code": "x = 0  # Auto-initialized\nprint(x)",
  "repaired": true,
  "total_iterations": 2
}
```

#### Test Case 2: RecursionError (Factorial)
```bash
curl -X POST http://localhost:8000/repair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def factorial(n):\n    return n * factorial(n-1)\nprint(factorial(5))",
    "max_iterations": 3,
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "iterations": [
    {
      "iteration": 1,
      "execution": {
        "status": "error",
        "error": "RecursionError: maximum recursion depth exceeded"
      },
      "patch": {
        "reasoning": "Added base case for recursion on 'n'.",
        "confidence": 0.6
      }
    },
    {
      "iteration": 2,
      "execution": {
        "status": "success",
        "output": "120\n"
      }
    }
  ],
  "repaired": true,
  "total_iterations": 2
}
```

#### Test Case 3: Off-by-One Error
```bash
curl -X POST http://localhost:8000/repair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def sum_array(arr):\n    total = 0\n    for i in range(len(arr) + 1):\n        total += arr[i]\n    return total\nprint(sum_array([1, 2, 3]))",
    "max_iterations": 3,
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "iterations": [
    {
      "iteration": 1,
      "execution": {
        "status": "error",
        "error": "IndexError: list index out of range"
      },
      "patch": {
        "reasoning": "Added bounds check for 'arr'."
      }
    },
    {
      "iteration": 2,
      "execution": {
        "status": "success",
        "output": "6\n"
      }
    }
  ],
  "repaired": true
}
```

#### Test Case 4: TypeError (String Concatenation)
```bash
curl -X POST http://localhost:8000/repair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Number: \" + 42)",
    "max_iterations": 3,
    "timeout": 5
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "iterations": [
    {
      "iteration": 1,
      "execution": {
        "status": "error",
        "error": "TypeError: can only concatenate str (not \"int\") to str"
      },
      "patch": {
        "reasoning": "Converted integer to string for concatenation.",
        "confidence": 0.7
      }
    },
    {
      "iteration": 2,
      "execution": {
        "status": "success",
        "output": "Number: 42\n"
      }
    }
  ],
  "repaired": true
}
```

---

## Test Cases Summary

| Endpoint | Test Case | Expected Status | Expected Behavior |
|----------|-----------|----------------|-------------------|
| `/health` | Health Check | 200 OK | Returns server status |
| `/run` | Success | 200 OK | Executes code, returns output |
| `/run` | Runtime Error | 200 OK | Returns error details |
| `/run` | Validation Error | 200 OK | Blocks forbidden code |
| `/run` | Timeout | 200 OK | Terminates after timeout |
| `/patch` | ZeroDivisionError | 200 OK | Generates fix for division by zero |
| `/patch` | NameError | 200 OK | Initializes undefined variable |
| `/patch` | IndexError | 200 OK | Adds bounds check |
| `/repair` | NameError | 200 OK | Auto-repairs in 2 iterations |
| `/repair` | RecursionError | 200 OK | Adds base case |
| `/repair` | Off-by-One | 200 OK | Fixes array bounds |
| `/repair` | TypeError | 200 OK | Converts types |

---

## Automated Testing

### Run All Tests
```bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
python3 -m pytest backend/tests/ -v
```

### Run Specific Test File
```bash
python3 -m pytest backend/tests/test_sandbox.py -v
python3 -m pytest backend/tests/test_patch_engine.py -v
python3 -m pytest backend/tests/test_repair_loop.py -v
```

---

## Troubleshooting

### Server Not Running
```bash
# Check if server is running
curl http://localhost:8000/health

# If not, start it
uvicorn backend.main:app --reload --port 8000
```

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Import Errors
```bash
# Ensure PYTHONPATH is set
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Or run from project root
cd /home/shaggy/Public/ReCodeX
```

---

## Interactive API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test all endpoints directly from the browser using these interfaces.
