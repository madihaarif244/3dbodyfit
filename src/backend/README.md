
# 3DBodyFit Backend API

This is the backend API for 3DBodyFit, handling body measurement processing.

## Setup

1. Make sure you have Python 3.8+ installed
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the API

### Option 1: Directly with Python

```bash
# Run the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the provided convenience script:

```bash
# Make the script executable first
chmod +x run.sh

# Run the script
./run.sh
```

### Option 2: Using Docker

From the main project directory:

```bash
# Build and run all services
docker-compose up

# Or build and run just the backend
docker-compose up backend
```

## API Documentation

Once running, you can access the interactive API documentation at:
http://localhost:8000/docs

## Endpoints

- `GET /`: Health check endpoint
- `POST /process-measurements`: Main endpoint for processing body measurements

### Example Request

```json
{
  "gender": "male",
  "height": "175",
  "measurementSystem": "metric",
  "frontImageBase64": "data:image/jpeg;base64,...",
  "sideImageBase64": "data:image/jpeg;base64,..."
}
```

### Example Response

```json
{
  "measurements": {
    "chest": 92.5,
    "waist": 78.3,
    "hips": 88.2,
    "inseam": 81.7,
    "shoulder": 42.1,
    "sleeve": 65.3,
    "neck": 37.8,
    "thigh": 56.4,
    "height": 175.0
  },
  "confidence": 0.87
}
```
