
/*
  Utility to clean and format error messages received from the backend.
*/

export const formatError = (rawError = "") => {
  if (!rawError || typeof rawError !== "string") return "Unknown error";

  let formatted = rawError;

  // 1. Remove long file paths like:
  formatted = formatted.replaceAll(/File\s+".+?",\s+line\s+\d+/g, "");

  // 2. Replace multiple whitespace/newlines with a cleaner version
  formatted = formatted.replace(/\s+/g, " ").trim();

  // 3. Highlight common Python errors
  formatted = formatted
    .replace("IndexError", "IndexError ❗")
    .replace("TypeError", "TypeError ⚠")
    .replace("NameError", "NameError ⚠")
    .replace("SyntaxError", "SyntaxError 🛑");

  // 4. If nothing useful found
  if (formatted.length === 0) return "Error occurred (empty message)";

  return formatted;
};


/*
  Extract line number if present in an error trace.
*/

export const extractLineNumber = (rawError = "") => {
  const match = rawError.match(/line\s+(\d+)/i);
  return match ? parseInt(match[1]) : null;
};
