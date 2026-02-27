#!/bin/bash

echo "🚀 Setting up NearHelp..."

# Install dependencies
npm install

# Create .env from .env.example if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
fi

echo "✅ Setup complete. Run ./web.sh to start the application."
