export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

export interface PredictionResponse {
  predicted_price: number;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

async function parseError(response: Response): Promise<string> {
  try {
    const errorData = await response.json();

    if (Array.isArray(errorData.detail)) {
      return errorData.detail
        .map((error: { msg?: string }) => error.msg || "Invalid input")
        .join(", ");
    }

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }
  } catch {
    // Keep the default message.
  }

  return "Something went wrong. Please try again.";
}

export async function getLocations(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/locations`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as { locations: string[] };
  return data.locations;
}

export async function predictPrice(
  data: PredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
