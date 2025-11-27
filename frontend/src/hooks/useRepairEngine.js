import { useState } from "react";
import { useApi } from "./useApi";

/*
  This hook manages the entire repair workflow:
*/

export const useRepairEngine = () => {
  const { executeCode, createPatch, repairAutomatically } = useApi();

  // ---------- GLOBAL STATE ----------
  const [originalCode, setOriginalCode] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [finalCode, setFinalCode] = useState("");

  const [logs, setLogs] = useState("");
  const [error, setError] = useState("");
  const [patch, setPatch] = useState("");

  const [iterations, setIterations] = useState([]); // iteration-wise results
  const [repairStep, setRepairStep] = useState(0);  // step number for UI animations
  const [loading, setLoading] = useState(false);     // loader for UI

  // ---------- 1. SET INITIAL CODE ----------
  const loadCode = (code) => {
    setOriginalCode(code);
    setCurrentCode(code);
  };

  // ---------- 2. RUN CODE (calls /run) ----------
  const runCurrentCode = async () => {
    setLoading(true);

    const result = await executeCode(currentCode);

    setLogs(result.logs || "");
    setError(result.error || "");
    setLoading(false);

    return result;
  };

  // ---------- 3. GENERATE PATCH (calls /patch) ----------
  const generatePatchFromError = async () => {
    if (!error) return null;

    setLoading(true);

    const result = await createPatch(logs, currentCode);

    setPatch(result.patch || "");
    setLoading(false);

    return result;
  };

  // ---------- 4. APPLY PATCH LOCALLY ----------
  const applyPatchLocally = (patchedCode) => {
    if (!patchedCode) return;

    setCurrentCode(patchedCode);
  };

  // ---------- 5. FULL AUTOMATIC REPAIR LOOP ----------
  const startFullRepair = async (iterations = 3) => {
    setLoading(true);
    setRepairStep(1);

    const result = await repairAutomatically(currentCode, iterations);

    setIterations(result.iterations || []);
    setFinalCode(result.finalCode || "");
    setRepairStep(2);

    setLoading(false);

    return result;
  };

  // ---------- 6. RESET EVERYTHING ----------
  const resetEngine = () => {
    setOriginalCode("");
    setCurrentCode("");
    setFinalCode("");
    setLogs("");
    setError("");
    setPatch("");
    setIterations([]);
    setRepairStep(0);
  };

  return {
    // state
    originalCode,
    currentCode,
    finalCode,
    logs,
    error,
    patch,
    iterations,
    repairStep,
    loading,

    // functions
    loadCode,
    runCurrentCode,
    generatePatchFromError,
    applyPatchLocally,
    startFullRepair,
    resetEngine,
  };
};
