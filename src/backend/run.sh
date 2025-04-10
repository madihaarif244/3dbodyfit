
#!/bin/bash
echo "Starting 3DBodyFit Backend API..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
