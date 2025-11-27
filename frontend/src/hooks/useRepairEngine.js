// src/hooks/useRepairEngine.js
import { useState } from "react";
import { runCode, generatePatch, startRepair } from "../utils/api";

export function useRepairEngine() {
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]); // [{ prev, next, stdout, stderr, ai_reasoning }]
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [aiReasoning, setAiReasoning] = useState("");

  // ---------------- LOAD CODE ----------------
  const loadCode = (newCode) => {
    const safe = typeof newCode === "string" ? newCode : String(newCode || "");
    setCode(safe);
    setError("");
    setLogs("");
  };

  // ---------------- RUN CODE ----------------
  const runCurrentCode = async (overrideCode) => {
    const toRun = typeof overrideCode === "string" ? overrideCode : code;

    if (!toRun.trim()) {
      setError("No code to run");
      return;
    }

    setLogs("Running...");
    setError("");

    const res = await runCode(toRun);

    if (res?.error) {
      setError(res.error);
      setLogs(res.raw || "");
      return res;
    }

    setLogs(res.stdout || res.output || "");
    setError(res.stderr || "");

    return res;
  };

  // ---------------- CREATE SINGLE PATCH ----------------
  const createPatch = async () => {
    const res = await generatePatch(logs, code);
    if (res?.error) {
      setError(res.error);
      return null;
    }

    const newCode =
      res.patch || res.code || res.new_code || (typeof res === "string" ? res : null);

    if (!newCode) {
      setError("Patch response missing code");
      return null;
    }

    const entry = {
      prev: code,
      next: newCode,
      stdout: res.stdout || "",
      stderr: res.stderr || "",
      ai_reasoning: res.ai_reasoning || "",
      rejected: false,
    };

    setHistory((old) => {
      const nextHist = [...old, entry];
      setSelectedIndex(nextHist.length - 1);
      return nextHist;
    });

    return newCode;
  };

  // ---------------- FULL AUTO REPAIR LOOP ----------------
  const startFullRepair = async (iterations = 3) => {
    if (!code.trim()) {
      setError("No code to repair");
      return;
    }

    setLogs("Repair started…");
    setError("");
    setHistory([]);
    setSelectedIndex(null);
    setAiReasoning("");

    const res = await startRepair(code, iterations);

    if (res?.error) {
      setError(res.error);
      return;
    }

    const backendSteps = res.history || [];
    const fixedHistory = [];

    for (let i = 0; i < backendSteps.length; i++) {
      const cur = backendSteps[i];
      const prevCode = i === 0 ? code : backendSteps[i - 1].code;
      const nextCode = cur.code;

      fixedHistory.push({
        prev: prevCode,
        next: nextCode,
        stdout: cur.stdout || "",
        stderr: cur.stderr || "",
        ai_reasoning: cur.ai_reasoning || "",
        rejected: false,
      });
    }

    setHistory(fixedHistory);

    if (fixedHistory.length > 0) {
      const last = fixedHistory[fixedHistory.length - 1];
      setSelectedIndex(fixedHistory.length - 1);
      setLogs(last.stdout);
      setError(last.stderr);
      setAiReasoning(last.ai_reasoning);
      setCode(last.next);
    }

    return res;
  };

  // ---------------- APPLY PATCH ----------------
  const applyHistory = (index) => {
    if (index == null || index < 0 || index >= history.length) return false;

    const entry = history[index];
    if (!entry || typeof entry.next !== "string") {
      console.warn("applyHistory: invalid entry", entry);
      return false;
    }

    // APPLY the new code from AI
    const newCode = entry.next;
    setCode(newCode);
    loadCode(newCode);  // update engine state properly

    console.log("🔧 Applied patch:", newCode);

    // Move to next patch (if exists)
    const nextIndex = index + 1 < history.length ? index + 1 : null;
    setSelectedIndex(nextIndex);

    return true;
    
  };

  // ---------------- REJECT PATCH ----------------
  const rejectHistory = (index) => {
    if (index < 0 || index >= history.length) {
      console.warn("rejectHistory: invalid index", index);
      return false;
    }

    // Mark rejected
    setHistory((prev) =>
      prev.map((h, i) => (i === index ? { ...h, rejected: true } : h))
    );

    // Move to the next non-rejected item
    let next = null;
    for (let i = index + 1; i < history.length; i++) {
      if (!history[i]?.rejected) {
        next = i;
        break;
      }
    }

    setSelectedIndex(next);

    return true;
  };

  // ---------------- SELECT PATCH FOR DIFF VIEW ----------------
  const selectHistoryIndex = (index) => {
    if (index == null || index < 0 || index >= history.length) {
      setSelectedIndex(null);
      return;
    }

    const step = history[index];
    setSelectedIndex(index);
    setLogs(step.stdout || "");
    setError(step.stderr || "");
    setAiReasoning(step.ai_reasoning || "");
  };

  return {
    // state
    code,
    logs,
    error,
    history,
    selectedIndex,
    aiReasoning,

    // actions
    loadCode,
    runCurrentCode,
    createPatch,
    startFullRepair,
    applyHistory,
    rejectHistory,
    selectHistoryIndex,

    // compatibility aliases
    applyPatch: applyHistory,
    rejectPatch: rejectHistory,
  };
}

export default useRepairEngine;
