#!/bin/sh
set -e

echo "Running go mod tidy..."
go mod tidy

echo "Starting application with air..."
exec "$@"
