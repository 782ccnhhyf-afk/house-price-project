from fastapi.testclient import TestClient

from app.main import app


def test_prediction_happy_path():
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={
                "location": "mumbai",
                "carpet_area_sqft": 1000,
                "floor_num": 1,
                "bathroom": 2,
                "balcony": 1,
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "predicted_price" in data
        assert isinstance(data["predicted_price"], (int, float))
        assert data["predicted_price"] > 0


def test_prediction_rejects_invalid_area():
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={
                "location": "mumbai",
                "carpet_area_sqft": 0,
                "floor_num": 1,
                "bathroom": 2,
                "balcony": 1,
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East",
            },
        )

        assert response.status_code == 422
