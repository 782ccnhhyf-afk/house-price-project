from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router
from app.core.config import settings
from app.services.inference import load_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_path = Path(settings.model_path)
    load_model(model_path)
    yield


app = FastAPI(
    title="House Price Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https?://192\.168\.\d{1,3}\.\d{1,3}:\d+",
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(router)
