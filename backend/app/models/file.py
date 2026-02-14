# app/models/file.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class BaseFile(SQLModel):
    original_name:str
    file_size:int
    content_type:str
    extension:str
    uploaded_at:datetime = Field(default=datetime.now)

class FileDto(BaseFile):
    pass

class TableFile(BaseFile, table=True):#table=TrueでDBのテーブルになる
    id: Optional[int] = Field(default=None, primary_key=True)
    stored_name:str #uuidでつけて保存したい