import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getLocations, predictPrice } from "../api/predictionClient";
import type { PredictionRequest } from "../api/predictionClient";

const initialForm: PredictionRequest = {
  location: "Other",
  carpet_area_sqft: 1000,
  floor_num: 1,
  bathroom: 2,
  balcony: 1,
  furnishing: "Semi-Furnished",
  transaction: "Resale",
  ownership: "Freehold",
  facing: "East",
};

function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PredictionRequest>(initialForm);
  const [locations, setLocations] = useState<string[]>(["Other"]);
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getLocations()
      .then((items) => {
        if (!active) return;
        setLocations(items);
        if (!items.includes(formData.location)) {
          setFormData((current) => ({ ...current, location: items[0] ?? "Other" }));
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? `Could not load locations: ${err.message}`
              : "Could not load locations."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingLocations(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updateField(field: keyof PredictionRequest, value: string | number) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (formData.carpet_area_sqft <= 0) {
      setError("Carpet area must be greater than 0.");
      return;
    }

    if (!formData.location) {
      setError("Please select a location.");
      return;
    }

    setLoading(true);

    try {
      const result = await predictPrice(formData);
      sessionStorage.setItem("predictedPrice", String(result.predicted_price));
      navigate("/result", { state: { price: result.predicted_price } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to get prediction."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-card">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Property details</p>
          <h2>Tell us about the property</h2>
        </div>
        <span className="step-label">9 inputs</span>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <label>
          <span>Location</span>
          <select
            value={formData.location}
            disabled={loadingLocations}
            onChange={(event) => updateField("location", event.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Carpet area (sqft)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.carpet_area_sqft}
            onChange={(event) =>
              updateField("carpet_area_sqft", Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>Floor</span>
          <input
            type="number"
            min="0"
            step="1"
            value={formData.floor_num}
            onChange={(event) => updateField("floor_num", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Bathrooms</span>
          <input
            type="number"
            min="0"
            step="1"
            value={formData.bathroom}
            onChange={(event) => updateField("bathroom", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Balconies</span>
          <input
            type="number"
            min="0"
            step="1"
            value={formData.balcony}
            onChange={(event) => updateField("balcony", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Furnishing</span>
          <select
            value={formData.furnishing}
            onChange={(event) => updateField("furnishing", event.target.value)}
          >
            <option>Furnished</option>
            <option>Semi-Furnished</option>
            <option>Unfurnished</option>
          </select>
        </label>

        <label>
          <span>Transaction</span>
          <select
            value={formData.transaction}
            onChange={(event) => updateField("transaction", event.target.value)}
          >
            <option>New Property</option>
            <option>Resale</option>
          </select>
        </label>

        <label>
          <span>Ownership</span>
          <select
            value={formData.ownership}
            onChange={(event) => updateField("ownership", event.target.value)}
          >
            <option>Freehold</option>
            <option>Leasehold</option>
          </select>
        </label>

        <label>
          <span>Facing</span>
          <select
            value={formData.facing}
            onChange={(event) => updateField("facing", event.target.value)}
          >
            <option>East</option>
            <option>West</option>
            <option>North</option>
            <option>South</option>
          </select>
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="predict-button" type="submit" disabled={loading || loadingLocations}>
          {loading ? "Predicting..." : "Estimate house price →"}
        </button>
      </form>
    </section>
  );
}

export default PredictionForm;
