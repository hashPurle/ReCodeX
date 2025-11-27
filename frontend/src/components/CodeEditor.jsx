
import React from "react";
import Editor from "@monaco-editor/react";

/*
  CodeEditor Component
  --------------------
  - Reusable Monaco Editor wrapper
  - Connects directly with your repair engine logic
  - Works independently of UI styling
*/

const CodeEditor = ({
  code,
  onChange,
  readOnly = false,
  height = "100%",
  language = "python",
}) => {
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={code}
      theme="vs-dark"
      onChange={(value) => onChange(value)}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        roundedSelection: false,
      }}
    />
  );
};

export default CodeEditor;
