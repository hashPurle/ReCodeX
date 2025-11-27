# ReCodeX Backend - Quick Reference

## 🚀 Quick Start
```bash
# Start server
uvicorn backend.main:app --reload --port 8000

# Test health
curl http://localhost:8000/health
```

## 📡 Endpoints

### 1. Health Check
```bash
GET http://localhost:8000/health
```

### 2. Run Code
```bash
POST http://localhost:8000/run
Content-Type: application/json

{
  "code": "print('Hello')",
  "timeout": 5,
  "memory_limit_mb": 100
}
```

### 3. Generate Patch
```bash
POST http://localhost:8000/patch
Content-Type: application/json

{
  "code": "print(x)",
  "error": "NameError: name 'x' is not defined",
  "stack_trace": "..."
}
```

### 4. Repair Code
```bash
POST http://localhost:8000/repair
Content-Type: application/json

{
  "code": "def f(n): return f(n-1)",
  "max_iterations": 3,
  "timeout": 5
}
```

## 🧪 Quick Tests

### Test 1: Success
```bash
curl -X POST http://localhost:8000/run -H "Content-Type: application/json" \
  -d '{"code": "print(2 + 3)"}'
```

### Test 2: Error
```bash
curl -X POST http://localhost:8000/run -H "Content-Type: application/json" \
  -d '{"code": "print(1/0)"}'
```

### Test 3: Repair
```bash
curl -X POST http://localhost:8000/repair -H "Content-Type: application/json" \
  -d '{"code": "print(x)", "max_iterations": 3}'
```

## 📚 Documentation
- **Setup:** `backend/README.md`
- **Testing:** `backend/TESTING_GUIDE.md`
- **Summary:** `backend/IMPLEMENTATION_SUMMARY.md`
- **Postman:** `backend/ReCodeX_Postman_Collection.json`
- **Interactive:** http://localhost:8000/docs

## 🔒 Security
- ✅ Forbidden imports: `os`, `sys`, `subprocess`, `socket`
- ✅ Forbidden builtins: `exec`, `eval`, `open`, `input`
- ✅ Timeout: Default 5s
- ✅ Memory: Default 100MB (Linux)

## 🐛 Supported Errors
- `NameError` → Initialize variable
- `ZeroDivisionError` → Add check
- `RecursionError` → Add base case
- `IndexError` → Add bounds check
- `TypeError` → Convert types
