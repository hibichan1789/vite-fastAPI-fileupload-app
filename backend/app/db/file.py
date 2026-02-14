# app/db/file.py
import os
from sqlmodel import create_engine, Session, SQLModel

sqlite_url = os.getenv("SQLITE_URL", "sqlite:////code/db/database.db")#backend

engine = create_engine(sqlite_url, connect_args={"check_same_thread":False}, echo=True)#マルチスレッドエラーを防ぐ、echoでクエリのログが出る

def create_db_and_tables():
    from ..models.file import TableFile
    #create_allを実行する前にTableFileを参照しておかないとテーブルが作られない
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session