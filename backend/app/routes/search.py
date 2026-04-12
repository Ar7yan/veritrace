from fastapi import APIRouter
from pydantic import BaseModel
from app.services.web_search import search_propagation

router = APIRouter()

class SearchRequest(BaseModel):
    text: str

@router.post("/")
async def search_content(request: SearchRequest):
    result = await search_propagation(request.text)
    return result