#!/bin/bash
set -e

echo "=== DoodlePitch Setup ==="

# Check for virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment .venv..."
    python3 -m venv .venv
fi

echo "Installing dependencies..."
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt

echo "Starting server on http://localhost:8000..."
.venv/bin/python server.py
