from fastapi import FastAPI
from .routes.premium import router as premium_router

app = FastAPI()

app.include_router(premium_router)

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}