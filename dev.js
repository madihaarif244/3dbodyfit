
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Execute the vite command from the node_modules directory
try {
  console.log('Starting the development server...');
  execSync('node_modules/.bin/vite', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start the development server:', error);
  process.exit(1);
}
