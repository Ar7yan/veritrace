from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router
from app.routes.search  import router as search_router
from app.routes.image   import router as image_router

app = FastAPI(title="Veritrace API", version="2.0.0")

# Wide open CORS — fine for hackathon/local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api/analyze", tags=["Text Analysis"])
app.include_router(search_router,  prefix="/api/search",  tags=["Search"])
app.include_router(image_router,   prefix="/api/image",   tags=["Image Analysis"])

@app.get("/")
def root():
    return {"message": "Veritrace API v2.0 running"}