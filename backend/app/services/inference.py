from pathlib import Path

import joblib
import pandas as pd

from app.services.preprocessing import prepare_location


MODEL = None


def load_model(model_path: str | Path) -> None:
    """Load the trained pipeline once during FastAPI startup."""
    global MODEL
    path = Path(model_path)
    if not path.is_absolute():
        path = Path(__file__).resolve().parents[2] / path
    MODEL = joblib.load(path)


def predict_price(request):
    if MODEL is None:
        raise RuntimeError("Model is not loaded. Please restart the API server.")

    data = pd.DataFrame([{
        "carpet_area_sqft": request.carpet_area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "location_grouped": prepare_location(request.location),
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }])

    prediction = MODEL.predict(data)[0]
    return float(prediction)
