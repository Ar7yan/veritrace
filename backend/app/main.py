from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router
from app.routes.search import router as search_router
from app.routes.image import router as image_router

app = FastAPI(title="Veritrace API", version="2.0.0")

# ✅ FIXED CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://veritrace-beta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api/analyze")
app.include_router(search_router, prefix="/api/search")
app.include_router(image_router, prefix="/api/image")

@app.get("/")
def root():
    return {"message": "Veritrace API v2.0 running"}