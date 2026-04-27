from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import time

load_dotenv()

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")

client = genai.Client(api_key=GEMINI_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIActionRequest(BaseModel):
    action: str
    secret_mode: bool = False


@app.get("/")
def home():
    return {
        "message": "Birthday Gemini backend running",
        "model": GEMINI_MODEL,
        "api_key_loaded": bool(GEMINI_API_KEY),
    }


@app.post("/ai-action")
def ai_action(req: AIActionRequest):
    if not GEMINI_API_KEY:
        return {"reply": "AI is not ready yet 💖"}

    prompts = {
        "wish": "Write a short romantic birthday wish for my girlfriend. 2-3 lines.",
        "compliment": "Write a sweet classy compliment for my girlfriend. 2-3 lines.",
        "poem": "Write a short romantic poem for my girlfriend. 4 lines.",
        "surprise": "Write a cute surprise birthday message. 2-3 lines.",
    }

    prompt = prompts.get(req.action, prompts["wish"])

    system_instruction = """
You are Birthday Magic AI inside a romantic birthday website.

Rules:
- Keep responses short, emotional, and beautiful
- Sound natural like ChatGPT
- Do not be robotic
- Make her feel special
"""

    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[{"role": "user", "parts": [{"text": prompt}]}],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.8,
                    top_p=0.9,
                    max_output_tokens=150,
                ),
            )

            if hasattr(response, "text") and response.text:
                return {"reply": response.text.strip()}

            # fallback parsing
            try:
                return {
                    "reply": response.candidates[0].content.parts[0].text
                }
            except:
                pass

        except Exception as e:
            print("Gemini error:", e)
            time.sleep(2)

    # fallback responses (VERY IMPORTANT)
    fallback = {
        "wish": "Happy Birthday 💖 You deserve all the love, happiness, and magic in the world today ✨",
        "compliment": "You have the most beautiful soul and a smile that makes everything feel brighter 🌸",
        "poem": "Like stars above that softly glow,\nYou light up every place you go.\nToday’s your day, so shine so bright,\nMy world is better with your light 💖",
        "surprise": "Surprise ✨ This little world was made just to remind you how loved you truly are 💖",
    }

    return {"reply": fallback.get(req.action, fallback["wish"])}