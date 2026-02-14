from datetime import datetime
from zoneinfo import ZoneInfo
import uuid
from fastapi import UploadFile
import aiofiles
def validate_file_size(target_size:int|None, max_mb:int=10)->bool:
    if not target_size or target_size==0:
        return False
    return target_size <= max_mb*1024*1024
def get_now()->datetime:
    return datetime.now(ZoneInfo("Asia/Tokyo"))
def get_unique_name(extension:str)->str:
    return f"{uuid.uuid4()}{extension}"
def get_file_size(file:UploadFile)->int:
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    return file_size
async def save_file_async(file:UploadFile, stored_path:str, chunk_size:int=1024*1024):
    try:
        async with aiofiles.open(stored_path, "wb") as f:
            while True:
                chunk = await file.read(chunk_size)#UploadFileをチャンクサイズ分読み込む
                if not chunk:
                    break
                await f.write(chunk)
    except Exception as e:
        print("ファイルの保存に失敗しました")
        print(e)
        raise
    finally:
        await file.seek(0)