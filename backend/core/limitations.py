MAX_TIMEOUT_SECONDS = 10
MAX_MEMORY_MB = 256
MAX_CODE_LENGTH = 10000

# Modules that are strictly forbidden
FORBIDDEN_IMPORTS = {
    "os", "sys", "subprocess", "shutil", "importlib", "builtins", 
    "socket", "requests", "urllib", "http", "pickle"
}

# Built-in functions that are strictly forbidden
FORBIDDEN_BUILTINS = {
    "exec", "eval", "compile", "open", "input", "help", "exit", "quit"
}

# Allowed standard libraries (safelist approach is safer, but blocklist is requested/implied)
# We stick to blocklist for now as per PRD "Restrict dangerous builtins"