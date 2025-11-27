// src/hooks/useRepairEngine.js

import { useState } from "react";
import { runCode, repairCode } from "../utils/api";

/*
  Engine responsibilities:
  ------------------------
  ✔ Store active code
  ✔ Run code (mock or backend)
  ✔ Start full repair (mock or backend)
  ✔ Maintain:
      • error messages
      • logs
      • patch history
      • final repaired code
  ✔ Provide clean API for App.jsx
*/

export const useRepairEngine = () => {
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [logs, setLogs] = useState("");
  const [history, setHistory] = useState([]); // patch versions
  const [finalCode, setFinalCode] = useState("");

  /* -----------------------------------------------------------
     1. LOAD CODE (Called on every keystroke in App.jsx)
  ------------------------------------------------------------ */
  const loadCode = (newCode) => {
    setCode(newCode);
  };

  /* -----------------------------------------------------------
     2. RUN CODE ON BACKEND (or mock)
  ------------------------------------------------------------ */
  const runCurrentCode = async () => {
    if (!code.trim()) return;

    const res = await runCode({ code });

    setError(res.error || "");
    setLogs(res.logs || []);

    return res;
  };

  /* -----------------------------------------------------------
     3. FULL AUTO-REPAIR LOOP (backend or mock)
        Returns:
        {
           history: [v1, v2, v3],
           finalCode: "...",
           logs: [...],
           error: null
        }
  ------------------------------------------------------------ */
  const startFullRepair = async (iterations = 3) => {
    if (!code.trim()) return;

    const result = await repairCode({
      code,
      iterations
    });

    // Update engine states
    setHistory(result.history || []);
    setFinalCode(result.finalCode || "");
    setLogs(result.logs || []);
    setError(result.error || "");

    return result;
  };

  /* -----------------------------------------------------------
     4. RESET ENGINE (optional)
  ------------------------------------------------------------ */
  const reset = () => {
    setError("");
    setLogs([]);
    setHistory([]);
    setFinalCode("");
  };

  return {
    // state
    code,
    error,
    logs,
    history,
    finalCode,

    // actions
    loadCode,
    runCurrentCode,
    startFullRepair,
    reset
  };
};
