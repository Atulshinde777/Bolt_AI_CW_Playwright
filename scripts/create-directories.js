const fs = require('fs');
const path = require('path');

const directories = [
  'reports',
  'screenshots',
  'logs',
  'test-results'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Directory setup complete!');