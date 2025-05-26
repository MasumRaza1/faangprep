const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Create env.js content
const envContent = `
// This file is auto-generated. Do not modify it manually.
(function(window) {
  window.env = window.env || {};
  window.env.REACT_APP_GITHUB_API_TOKEN = '${process.env.REACT_APP_GITHUB_API_TOKEN || ''}';
})(window);
`;

// Write to public/env.js
fs.writeFileSync(
  path.join(__dirname, '../public/env.js'),
  envContent.trim()
);

console.log('Environment variables have been written to public/env.js'); 