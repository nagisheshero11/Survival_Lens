from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.premium import router as premium_router
from app.routes.disruption import router as disruption_router
from app.routes.fraud import router as fraud_router
from app.routes.claim import router as claim_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(premium_router)
app.include_router(disruption_router)
app.include_router(fraud_router)
app.include_router(claim_router)

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}