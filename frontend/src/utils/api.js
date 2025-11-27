// frontend/src/utils/api.js

import axios from "axios";
import mockData from "./mockTestData";

/*
  REAL BACKEND ROUTES (when available):
    POST http://localhost:8000/run
    POST http://localhost:8000/patch
    POST http://localhost:8000/repair

  If backend is offline, all functions fallback to mockTestData.
*/

// Configure axios
const api = axios.create({
  baseURL: "http://localhost:8000", // backend URL
  timeout: 5000,
});

// Helper wrapper (tries backend → fallback to mock)
async function tryRequest(endpoint, body, mockReturn) {
  try {
    const res = await api.post(endpoint, body);
    if (res?.data) {
      return res.data; // valid successful backend response
    }
    return mockReturn;
  } catch (err) {
    console.warn(`⚠ Backend offline (${endpoint}), using mock fallback.`);
    return mockReturn; // fallback
  }
}

/* -----------------------------------------------------------
   1. RUN CODE
   Returns:
     { output: "...", error: "...", logs: [...] }
------------------------------------------------------------ */
export async function runCode({ code }) {
  return await tryRequest("/run", { code }, mockData.mockRunResponse);
}

/* -----------------------------------------------------------
   2. GENERATE PATCH (optional for patch-level diff)
------------------------------------------------------------ */
export async function generatePatch({ logs, code }) {
  return await tryRequest("/patch", { logs, code }, mockData.mockPatchResponse);
}

/* -----------------------------------------------------------
   3. START FULL REPAIR
   Returns structure:
     {
       history: [...codeVersions],
       finalCode: "...",
       logs: [...],
       error: null
     }
------------------------------------------------------------ */
export async function repairCode({ code, iterations = 3 }) {
  return await tryRequest(
    "/repair",
    { code, iterations },
    mockData.mockRepairResponse
  );
}
