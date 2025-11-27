// frontend/src/utils/logger.js

/*
  logger.js
  ---------
  A lightweight logging helper that:
  - Adds colored logs in browser console
  - Helps debugging your repair engine
  - Can be disabled easily in production
*/

const DEBUG_ENABLED = true;

// -------- Colors for log themes --------
const styles = {
  info: "color: #58a6ff; font-weight: bold",
  success: "color: #3fb950; font-weight: bold",
  error: "color: #ff7b72; font-weight: bold",
  warn: "color: #f2cc60; font-weight: bold",
};

// -------- Logging Functions --------
export const logInfo = (msg, data = null) => {
  if (!DEBUG_ENABLED) return;
  console.log("%c[INFO]", styles.info, msg, data || "");
};

export const logSuccess = (msg, data = null) => {
  if (!DEBUG_ENABLED) return;
  console.log("%c[SUCCESS]", styles.success, msg, data || "");
};

export const logError = (msg, data = null) => {
  if (!DEBUG_ENABLED) return;
  console.log("%c[ERROR]", styles.error, msg, data || "");
};

export const logWarn = (msg, data = null) => {
  if (!DEBUG_ENABLED) return;
  console.log("%c[WARN]", styles.warn, msg, data || "");
};

// -------- Grouped logs (expandable sections) --------
export const logGroup = (title, callback) => {
  if (!DEBUG_ENABLED) return;
  console.group(title);
  callback();
  console.groupEnd();
};

export default {
  logInfo,
  logSuccess,
  logError,
  logWarn,
  logGroup,
};
