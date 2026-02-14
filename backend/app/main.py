# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.file import create_db_and_tables, create_engine
from contextlib import asynccontextmanager
from .routers import file_router
import os
@asynccontextmanager
async def lifespan(app:FastAPI):
    print("アプリを起動します")
    create_db_and_tables()
    yield
    print("アプリが終了しました")


app = FastAPI(lifespan=lifespan)
#CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(file_router.router)


@app.get("/")
def get_hello():
    print("hello")
    return {"message": "hello docker"}