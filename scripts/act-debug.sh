#!/bin/bash

# Debug failed workflows with minimal noise

echo "🔍 Debugging failed workflows..."
echo ""

# Function to debug workflow
debug_workflow() {
    local workflow_name="$1"
    local workflow_file="$2"
    local event_type="$3"
    
    echo "🔧 Debugging $workflow_name workflow:"
    echo "----------------------------------------"
    
    # Run and capture only errors and important messages
    act "$event_type" -W "$workflow_file" 2>&1 | \
        grep -E "(❌|❗|Error|Failed|error:|::error::|Unable to|No such file|command not found|exit code|Job failed)" | \
        head -10
    
    echo ""
}

# Debug each workflow that might be failing
debug_workflow "CI" ".github/workflows/ci.yml" "push"

echo "💡 Common fixes:"
echo "  - Make sure Docker is running"
echo "  - Try: docker pull catthehacker/ubuntu:act-latest"
echo "  - Check if act has permissions to access Docker" 