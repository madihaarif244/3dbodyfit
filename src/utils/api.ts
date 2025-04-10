
// API utility for connecting to the backend

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Processes body measurements with the backend API
 * @param gender User's gender
 * @param height User's height
 * @param measurementSystem Whether height is in metric or imperial
 * @param frontImage Front image file
 * @param sideImage Side image file
 * @returns Processed measurements
 */
export const processBodyMeasurements = async (
  gender: 'male' | 'female' | 'other',
  heightValue: string,
  measurementSystem: 'metric' | 'imperial',
  frontImage: File,
  sideImage: File
): Promise<Record<string, number>> => {
  try {
    console.log("Calling backend API for body measurements...");
    
    // Convert images to base64 for transmission
    const frontImageBase64 = await fileToBase64(frontImage);
    const sideImageBase64 = await fileToBase64(sideImage);
    
    // Prepare the request payload
    const payload = {
      gender,
      height: heightValue,
      measurementSystem,
      frontImageBase64,
      sideImageBase64
    };
    
    // Make API call
    const response = await fetch(`${API_URL}/process-measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Backend API response:", data);
    
    return data.measurements;
  } catch (error) {
    console.error("Error processing measurements with API:", error);
    throw error;
  }
};

/**
 * Converts a file to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
