#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Load environment variables from .env file
set -a
source .env
set +a

# Run build command
echo "Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

# Check if build directory exists
if [ ! -d ./build/server ]; then
    echo "Error: build directory not found after build"
    exit 1
fi

# Start the application using npm script
echo "Starting application..."
npm run start