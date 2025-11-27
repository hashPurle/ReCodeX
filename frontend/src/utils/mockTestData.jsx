// frontend/src/utils/mockTestData.js

/*
  mockTestData.js
  ----------------
  This file provides fake backend responses so you can
  test your repair engine, patch viewer, and timeline
  without connecting to a real backend.
*/

// ----------------------
// 1. Dummy /run response
// ----------------------
export const mockRunResponse = {
  output: "",
  error: `
Traceback (most recent call last):
  File "temp.py", line 4
    arr[10]
IndexError: list index out of range
`,
  logs: `[RUN] Program started...\n[ERROR] list index out of range`,
};

// -------------------------
// 2. Dummy /patch response
// -------------------------
export const mockPatchResponse = {
  patch: `
@@ -1,4 +1,4 @@
- for i in range(len(arr)):
+ for i in range(len(arr)-1):
  print(arr[i])
`,
};

// ---------------------------------------------
// 3. Dummy /repair response (Multi-step Repair)
// ---------------------------------------------
export const mockRepairResponse = {
  iterations: [
    {
      step: 1,
      error: "IndexError: list index out of range",
      patch: `
@@ -1,4 +1,4 @@
- for i in range(len(arr)):
+ for i in range(len(arr)-1):
  print(arr[i])
`,
      code: `for i in range(len(arr)-1):\n    print(arr[i])`,
    },
    {
      step: 2,
      error: null,
      patch: `
@@ -1,4 +1,4 @@
  for i in range(len(arr)-1):
-     print(arr)
+     print(arr[i])
`,
      code: `for i in range(len(arr)-1):\n    print(arr[i])`,
    },
  ],
  finalCode: `
def show(arr):
    for i in range(len(arr)-1):
        print(arr[i])

show([1,2,3])
`,
};

// ----------------------------
// 4. Export all test responses
// ----------------------------
export default {
  mockRunResponse,
  mockPatchResponse,
  mockRepairResponse,
};
