
#!/bin/bash

echo "Starting the 3DBodyFit application..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the development server using npx to ensure we use the local vite installation
echo "Starting development server..."
npx vite
