# app/routers/file_router.py
from fastapi import APIRouter, HTTPException, Header, File, UploadFile, Depends
from sqlmodel import Session, select
import os
from ..models.file import FileResponse, TableFile
from ..db.file import get_session
from ..utils import file_utils
router = APIRouter(prefix="/file", tags=["file"])
FILE_STORE_DIR_PATH = "/code/data"

MAX_MB = 10
@router.post("/upload", status_code=201)
async def post_file(
        file:UploadFile = File(..., media_type="multipart/form-data"),
        session:Session=Depends(get_session)
    ):
    file_name = file.filename
    if not file_name:
        raise HTTPException(status_code=400, detail="ファイル名がありません")
    original_name = os.path.basename(file_name)
    extension = os.path.splitext(original_name)[-1]
    stored_name = file_utils.get_unique_name(extension)
    content_type = file.content_type#これでコンテントタイプの取得
    file_size = file_utils.get_file_size(file)#これでファイルサイズの取得
    if not file_utils.validate_file_size(file_size, MAX_MB):
        raise HTTPException(status_code=413, detail=f"ファイルサイズは{MAX_MB}MBまでです")
    uploaded_at = file_utils.get_now()#ここはutilsに分割してもいいかも
    if not content_type:
        raise HTTPException(status_code=422)
    stored_path = os.path.join(FILE_STORE_DIR_PATH, stored_name)
    try:
        await file_utils.save_file_async(file, stored_path)
    except Exception as e:
        print(f"物理保存が失敗しました: {e}")
        raise HTTPException(status_code=500, detail="保存に失敗しました")
    table_file:TableFile = TableFile(
        original_name=original_name,
        stored_name=stored_name,
        file_size=file_size,
        content_type=content_type,
        extension=extension,
        uploaded_at=uploaded_at
    )
    try:
        session.add(table_file)
        session.commit()
        session.refresh(table_file)
    except Exception as e:
        print(f"DB保存に失敗しました :{e}")
        if os.path.exists(stored_path):
            try:
                print(f"{stored_path}を削除します")
                os.remove(stored_path)
            except Exception as re:
                print(f"削除に失敗しました,手動削除が必要です{stored_path}: {re}")
        raise HTTPException(status_code=500, detail="保存に失敗しました")
    print("保存に成功しました")
    return {"status": "ok"}

@router.get("/all", response_model=list[FileResponse])#response_modelを使えばfastAPIが自動でDTOに変換してくれる
def get_file_all(session:Session=Depends(get_session)):
    try:
        db_files = session.exec(select(TableFile)).all()
        return db_files
    except Exception as e:
        print(f"DBから取得に失敗しました: {e}")
        raise HTTPException(status_code=500, detail="データの取得に失敗しました")