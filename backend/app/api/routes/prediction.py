from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.inference import predict_price
from app.services.preprocessing import load_locations


router = APIRouter(tags=["prediction"])


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/locations")
def locations():
    return {"locations": load_locations()}


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        price = predict_price(request)
        return PredictionResponse(predicted_price=price)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
