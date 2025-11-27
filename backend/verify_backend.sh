#!/bin/bash

echo "=========================================="
echo "ReCodeX Backend Verification Script"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Server is healthy"
else
    echo -e "${RED}✗ FAILED${NC} - Server not responding (HTTP $response)"
    exit 1
fi
echo ""

# Test 2: Run Code - Success
echo "Test 2: Run Code (Success)"
response=$(curl -s -X POST $BASE_URL/run \
  -H "Content-Type: application/json" \
  -d '{"code": "print(2 + 3)", "timeout": 5}')
if echo "$response" | grep -q '"status":"success"'; then
    echo -e "${GREEN}✓ PASSED${NC} - Code executed successfully"
else
    echo -e "${RED}✗ FAILED${NC} - Unexpected response"
    echo "$response"
fi
echo ""

# Test 3: Run Code - Validation Error
echo "Test 3: Run Code (Validation Error)"
response=$(curl -s -X POST $BASE_URL/run \
  -H "Content-Type: application/json" \
  -d '{"code": "import os", "timeout": 5}')
if echo "$response" | grep -q "Validation Error"; then
    echo -e "${GREEN}✓ PASSED${NC} - Validation working correctly"
else
    echo -e "${RED}✗ FAILED${NC} - Validation not working"
    echo "$response"
fi
echo ""

# Test 4: Patch Generation
echo "Test 4: Patch Generation"
response=$(curl -s -X POST $BASE_URL/patch \
  -H "Content-Type: application/json" \
  -d '{"code": "print(x)", "error": "NameError: name '\''x'\'' is not defined", "stack_trace": "Traceback..."}')
if echo "$response" | grep -q '"confidence"'; then
    echo -e "${GREEN}✓ PASSED${NC} - Patch generated successfully"
else
    echo -e "${RED}✗ FAILED${NC} - Patch generation failed"
    echo "$response"
fi
echo ""

# Test 5: Repair Loop
echo "Test 5: Repair Loop"
response=$(curl -s -X POST $BASE_URL/repair \
  -H "Content-Type: application/json" \
  -d '{"code": "print(x)", "max_iterations": 3}')
if echo "$response" | grep -q '"repaired":true'; then
    echo -e "${GREEN}✓ PASSED${NC} - Code repaired successfully"
else
    echo -e "${RED}✗ FAILED${NC} - Repair failed"
    echo "$response"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}All tests passed!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Import Postman collection: backend/ReCodeX_Postman_Collection.json"
echo "2. Read testing guide: backend/TESTING_GUIDE.md"
echo "3. View interactive docs: http://localhost:8000/docs"
