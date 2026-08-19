from typing import Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str = Field(min_length=1)
    carpet_area_sqft: float = Field(gt=0)
    floor_num: Optional[float] = Field(default=None, ge=0)
    bathroom: Optional[float] = Field(default=None, ge=0)
    balcony: Optional[float] = Field(default=None, ge=0)
    furnishing: Optional[str] = None
    transaction: Optional[str] = None
    ownership: Optional[str] = None
    facing: Optional[str] = None


class PredictionResponse(BaseModel):
    predicted_price: float
