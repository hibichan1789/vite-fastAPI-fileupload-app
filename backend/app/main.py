# app/main.py
from fastapi import FastAPI
from .db.file import create_db_and_tables, create_engine
from contextlib import asynccontextmanager
from .routers import file_router

@asynccontextmanager
async def lifespan(app:FastAPI):
    print("アプリを起動します")
    create_db_and_tables()
    yield
    print("アプリが終了しました")


app = FastAPI(lifespan=lifespan)
app.include_router(file_router.router)


@app.get("/")
def get_hello():
    print("hello")
    return {"message": "hello docker"}