import React, { useEffect, useRef } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

export default function OutputPanel({
  logs = "",
  error = "",
  reasoning = "",
}) {
  const [tab, setTab] = React.useState("terminal");
  const scrollRef = useRef(null);

  // Auto-scroll smoothly whenever logs, errors, or reasoning updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, error, reasoning]);

  // Safe formatter
  const safe = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join("\n");
    return JSON.stringify(value, null, 2);
  };

  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0d1117",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #30363d",
      }}
    >
      {/* TABS HEADER */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          borderBottom: "1px solid #30363d",
          "& .MuiTab-root": {
            color: "#8b949e",
            textTransform: "none",
            minHeight: 0,
            py: 1,
            fontSize: 13,
          },
          "& .Mui-selected": { color: "#ffffff !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#58a6ff" },
        }}
      >
        <Tab label="TERMINAL" value="terminal" />
        <Tab label="AI REASONING" value="reasoning" />
      </Tabs>

      {/* MAIN OUTPUT WINDOW */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          fontFamily: "JetBrains Mono",
          fontSize: 14,
          color: "#c9d1d9",
          whiteSpace: "pre-wrap",
          backgroundColor: "#0d1117",
        }}
      >
        {tab === "terminal" ? (
          <>
            {/* Terminal Logs */}
            {logs ? (
              <Typography sx={{ color: "#c9d1d9" }}>{safe(logs)}</Typography>
            ) : (
              <Typography sx={{ color: "#687079" }}>output...</Typography>
            )}

            {/* Error Output */}
            {error && (
              <Typography
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 1,
                  background: "rgba(248, 81, 73, 0.15)",
                  color: "#ff7b72",
                }}
              >
                {safe(error)}
              </Typography>
            )}
          </>
        ) : (
          // AI Reasoning Panel
          <>
            {reasoning ? (
              <Typography sx={{ color: "#a5d6ff" }}>{safe(reasoning)}</Typography>
            ) : (
              <Typography sx={{ color: "#687079" }}>
                AI Reasoning
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
