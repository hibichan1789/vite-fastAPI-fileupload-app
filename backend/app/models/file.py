# app/models/file.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
class BaseFile(SQLModel):
    original_name:str
    file_size:int
    content_type:str
    extension:str
    uploaded_at:datetime

class FileDto(BaseFile):
    pass

class TableFile(BaseFile, table=True):#table=TrueでDBのテーブルになる
    id: Optional[int] = Field(default=None, primary_key=True)
    stored_name:str #uuidでつけて保存したい

class FileResponse(BaseFile):
    id: int
    stored_name:str