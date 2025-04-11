
#!/bin/bash

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the application using npx to ensure vite is found
echo "Starting the application..."
npx vite

