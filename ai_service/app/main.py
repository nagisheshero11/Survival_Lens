from fastapi import FastAPI
from app.routes.premium import router as premium_router
from app.routes.disruption import router as disruption_router

app = FastAPI()

# Include routes
app.include_router(premium_router)
app.include_router(disruption_router)

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}