import httpx
import re
import json

# Configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral" 

async def generate_patch(code: str, error: str) -> dict:
    """
    Asks AI to fix the code and extracts ONLY the Python block.
    """
    
    # 1. STRICTER PROMPT: We force the AI to use Markdown code blocks.
    prompt = f"""
    You are a Python expert. Fix the following code.
    
    BROKEN CODE:
    {code}
    
    ERROR:
    {error}
    
    INSTRUCTIONS:
    1. Return the fixed code inside a markdown block like this:
       ```python
       # code here
       ```
    2. DO NOT modify the logic unless necessary to fix the error.
    3. DO NOT output any text outside the code block.
    """

    print(f"--> [AI] Sending request to {MODEL_NAME}...")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": MODEL_NAME,
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                raw_response = result.get("response", "").strip()
                
                # --- ROBUST EXTRACTION LOGIC ---
                
                # Priority 1: Look for ```python ... ``` blocks (Best Case)
                match = re.search(r"```python(.*?)```", raw_response, re.DOTALL)
                if match:
                    fixed_code = match.group(1).strip()
                    return {
                        "patch": fixed_code,
                        "response": raw_response,
                        "prompt": prompt,
                        "confidence": 0.0
                    }
                
                # Priority 2: Look for generic ``` ... ``` blocks
                match = re.search(r"```(.*?)```", raw_response, re.DOTALL)
                if match:
                    fixed_code = match.group(1).strip()
                    return {
                        "patch": fixed_code,
                        "response": raw_response,
                        "prompt": prompt,
                        "confidence": 0.0
                    }
                
                # Priority 3: Fallback (Chatty AI without markdown)
                # We strip lines starting with "Here is", "Sure", "The code", etc.
                lines = raw_response.split('\n')
                clean_lines = []
                for line in lines:
                    # Filter out common AI chat starts
                    if not re.match(r"^(Here is|Sure|The code|This|In this|I have)", line, re.IGNORECASE):
                        clean_lines.append(line)
                
                fixed_code = "\n".join(clean_lines).strip()
                return {
                    "patch": fixed_code,
                    "response": raw_response,
                    "prompt": prompt,
                    "confidence": 0.0
                }

            else:
                print(f"Error from Ollama: {response.status_code}")
                return { "patch": code, "response": f"Error {response.status_code}", "prompt": prompt, "confidence": 0.0 }

    except Exception as e:
        print(f"Connection Error: {str(e)}")
        return { "patch": code, "response": str(e), "prompt": prompt, "confidence": 0.0 }