# app/routers/file_router.py
from fastapi import APIRouter
from ..models.file import FileDto, TableFile

router = APIRouter(prefix="/file", tags=["file"])

@router.get("")
def test():
    return {"message": "ok"}