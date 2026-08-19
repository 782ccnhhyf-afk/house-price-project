import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
LOCATIONS_FILE = BASE_DIR / "models" / "locations.json"


def load_locations() -> list[str]:
    with open(LOCATIONS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def prepare_location(location: str) -> str:
    """Normalize user input to the exact values used by the trained model."""
    locations = load_locations()
    lookup = {item.casefold(): item for item in locations}

    value = location.strip()
    if value.casefold() in lookup:
        return lookup[value.casefold()]

    return "Other"
