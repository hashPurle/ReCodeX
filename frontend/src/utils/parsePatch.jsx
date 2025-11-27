// frontend/src/utils/parsePatch.js

/*
  parsePatch.js
  -------------
  Converts backend unified diff strings into a cleaner
  structured format your UI can use.
*/

export const parsePatchLines = (patch = "") => {
  if (!patch || typeof patch !== "string") return [];

  const lines = patch.split("\n");

  return lines.map((line) => {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      return { type: "add", text: line.substring(1) };
    }
    if (line.startsWith("-") && !line.startsWith("---")) {
      return { type: "remove", text: line.substring(1) };
    }
    return { type: "context", text: line };
  });
};

/*
  Returns just the "added" lines, useful for UI highlights.
*/
export const getAddedLines = (patch = "") => {
  return parsePatchLines(patch).filter((l) => l.type === "add");
};

/*
  Returns just the "removed" lines.
*/
export const getRemovedLines = (patch = "") => {
  return parsePatchLines(patch).filter((l) => l.type === "remove");
};

/*
  Returns summary:
  - addedCount
  - removedCount
*/
export const summarizePatch = (patch = "") => {
  const parsed = parsePatchLines(patch);
  return {
    added: parsed.filter((l) => l.type === "add").length,
    removed: parsed.filter((l) => l.type === "remove").length,
  };
};
