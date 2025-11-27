// frontend/src/utils/patchHelpers.js

/*
  patchHelpers.js
  ----------------
  Helper functions for analyzing and manipulating unified diff patches.
  These extend parsePatch.js with:
  - patch merging
  - extracting changed lines
  - checking if patch is empty
*/

// ----------------------------------
// 1. Check if patch contains changes
// ----------------------------------
export const isPatchEmpty = (patch = "") => {
  if (!patch || typeof patch !== "string") return true;
  const lines = patch.split("\n");
  return !lines.some((line) => line.startsWith("+") || line.startsWith("-"));
};

// --------------------------------------------------------
// 2. Extract only added and removed text (clean lines only)
// --------------------------------------------------------
export const extractChangedText = (patch = "") => {
  if (!patch) return { added: [], removed: [] };

  const added = [];
  const removed = [];

  patch.split("\n").forEach((line) => {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      added.push(line.substring(1));
    }
    if (line.startsWith("-") && !line.startsWith("---")) {
      removed.push(line.substring(1));
    }
  });

  return { added, removed };
};

// ----------------------------------------
// 3. Merge two unified diff patches simply
// ----------------------------------------
export const mergePatches = (patch1 = "", patch2 = "") => {
  if (!patch1.trim()) return patch2;
  if (!patch2.trim()) return patch1;

  return `${patch1.trim()}\n${patch2.trim()}`;
};

// --------------------------------------------------
// 4. Count total additions and deletions in a patch
// --------------------------------------------------
export const countPatchChanges = (patch = "") => {
  let added = 0;
  let removed = 0;

  patch.split("\n").forEach((line) => {
    if (line.startsWith("+") && !line.startsWith("+++")) added++;
    if (line.startsWith("-") && !line.startsWith("---")) removed++;
  });

  return { added, removed };
};

// --------------------------------------------------------------
// 5. Highlight specific lines in Monaco (returns line numbers)
// --------------------------------------------------------------
export const extractModifiedLineNumbers = (patch = "") => {
  const lines = patch.split("\n");
  const modified = [];

  lines.forEach((line, index) => {
    if (
      (line.startsWith("+") || line.startsWith("-")) &&
      !line.startsWith("+++") &&
      !line.startsWith("---")
    ) {
      modified.push(index + 1); // human-readable
    }
  });

  return modified;
};
