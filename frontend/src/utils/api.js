import axios from "axios";

// 1. Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // backend url
  timeout: 5000, // timeout
});

// run code
export const runCode = async (code) => {
  try {
    const response = await api.post("/run", { code });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

// patch code for patch diff
export const generatePatch = async (logs, code) => {
  try {
    const response = await api.post("/patch", { logs, code });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

// repair code  
export const startRepair = async (code, iterations = 3) => {
  try {
    const response = await api.post("/repair", {
      code,
      iterations,
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};
