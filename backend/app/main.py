from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="REST API backend for Surplus-to-Shelter food rescue platform.",
    version="1.0.0",
    debug=settings.DEBUG,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "differentiator": "Donor Trust Layer + FSSAI 2019 Protection",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from app.database import init_db
init_db()

from app.routers import restaurants, certificates, ngos, ngo_verification
app.include_router(restaurants.router, prefix="/api/v1")
app.include_router(certificates.router, prefix="/api/v1")
app.include_router(ngos.router, prefix="/api/v1")
app.include_router(ngo_verification.router, prefix="/api/v1")


