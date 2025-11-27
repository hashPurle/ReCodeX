// src/utils/api.js
const BASE_URL = "http://127.0.0.1:8000";

/* ------------------------------
   Helper: unified POST + JSON
--------------------------------*/
async function postJson(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });

    // Read text first so both JSON and raw text are supported
    const text = await res.text();

    let parsed;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text; // fallback raw text
      
    }

    // Ensure errors are ALWAYS strings, never objects (prevents React crash)
    if (parsed && typeof parsed === "object" && parsed.detail) {
      return {
        status: res.status,
        data: null,
        error: typeof parsed.detail === "string"
          ? parsed.detail
          : JSON.stringify(parsed.detail)
      };
    }

    return { status: res.status, data: parsed };
  } catch (err) {
    return { status: 0, data: null, error: String(err.message || err) };
  }
}

/* ------------------------------
   /run
--------------------------------*/
export async function runCode(code) {
  if (!code || !code.trim()) {
    return { error: "Code is empty. Nothing to run." };
  }

  const resp = await postJson("/run", { code });

  if (resp.status === 200) return resp.data;

  return {
    error: resp.error || `Run failed (status ${resp.status})`,
    raw: resp.data
  };
}

/* ------------------------------
   /patch
--------------------------------*/
export async function generatePatch(logs, code) {
  const resp = await postJson("/patch", { logs, code });

  if (resp.status === 200) return resp.data;

  return {
    error: resp.error || `Patch failed (status ${resp.status})`,
    raw: resp.data
  };
}

/* ------------------------------
   /repair
--------------------------------*/
export async function startRepair(code, iterations = 3) {
  if (!code || !code.trim()) {
    return { error: "Code is empty. Cannot repair." };
  }

  const resp = await postJson("/repair", {
    code,
    max_iterations: iterations
  });

  if (resp.status === 200) return resp.data;

  return {
    error: resp.error || `Repair failed (status ${resp.status})`,
    raw: resp.data
  };
}
