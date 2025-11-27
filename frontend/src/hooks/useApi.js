// hooks all components into simple functions

import { runCode, generatePatch, startRepair } from "../utils/api";
export const useApi = () => {
  // ---- 1. Run Code (calls backend /run) ----
  const executeCode = async (code) => {
    const response = await runCode(code);
    return response;
  };

  // ---- 2. Generate Patch (calls backend /patch) ----
  const createPatch = async (logs, code) => {
    const response = await generatePatch(logs, code);
    return response;
  };

  // ---- 3. Autonomous Repair Loop (calls backend /repair) ----
  const repairAutomatically = async (code, iterations = 3) => {
    const response = await startRepair(code, iterations);
    return response;
  };

  return {
    executeCode,
    createPatch,
    repairAutomatically,
  };
};
