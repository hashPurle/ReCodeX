# Local AI-Supervised Autonomous Debugging Engine

## Tech Stack
- **Framework:** FastAPI (Python)
- **AI Engine:** Ollama (Mistral/Llama3) - Fully Offline
- **Sandboxing:** Python `subprocess` with timeout & memory constraints

## How to Run
1. Install dependencies: `pip install -r requirements.txt`
2. Ensure Ollama is running: `ollama run mistral`
3. Start Server: `python main.py`
4. Access API Docs: `http://localhost:8000/docs`

## Key Endpoints
- `POST /repair`: Takes broken code, analyzes execution logs, and auto-patches it using local LLM.