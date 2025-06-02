#!/bin/bash

echo "🧪 Testing GitHub Workflows Locally with Act"
echo "============================================="

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "❌ Act is not installed. Please install it first:"
    echo "   brew install act"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo ""
echo "🔍 Available workflows:"
act -l 2>/dev/null

echo ""
echo "🚀 Running CI workflow automatically..."
if act push -W .github/workflows/ci.yml --quiet 2>&1 | grep -E "(✅|❌|Error|Failed|Success)"; then
    echo "✅ CI workflow completed"
else
    echo "❌ CI workflow failed - check output above"
fi

echo ""
echo "✅ Workflow testing complete!" 