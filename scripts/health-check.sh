#!/bin/bash
set -e

echo "🏥 AFPI Health Check"
echo "===================="

# Function to check HTTP endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$response" == "$expected_status" ]; then
        echo "✅ OK ($response)"
        return 0
    else
        echo "❌ FAILED ($response)"
        return 1
    fi
}

# Check if services are running locally
echo ""
echo "Local Services:"
echo "==============="

check_endpoint "Backend API" "http://localhost:8000/health"
check_endpoint "Frontend" "http://localhost:3000"
check_endpoint "API Docs" "http://localhost:8000/api/v1/docs"

# Check database connection
echo ""
echo "Database:"
echo "========="
if mysql -h localhost -u root -ptoor -e "USE afpi; SELECT 1;" &> /dev/null; then
    echo "✅ MariaDB connection OK"
else
    echo "❌ MariaDB connection FAILED"
fi

# Check API endpoints
echo ""
echo "API Endpoints:"
echo "=============="

check_endpoint "Data Sources" "http://localhost:8000/api/v1/data-sources"
check_endpoint "Agents" "http://localhost:8000/api/v1/agents"
check_endpoint "Taxonomies" "http://localhost:8000/api/v1/taxonomies"
check_endpoint "Analytics Dashboard" "http://localhost:8000/api/v1/analytics/dashboard"

# Check disk space
echo ""
echo "System Resources:"
echo "================="
df -h / | awk 'NR==2 {print "Disk space: " $5 " used"}'

# Check memory
if command -v free &> /dev/null; then
    free -h | awk 'NR==2 {print "Memory: " $3 " / " $2 " used"}'
elif command -v vm_stat &> /dev/null; then
    # macOS
    echo "Memory: $(vm_stat | grep 'Pages active' | awk '{print $3}' | sed 's/\.//')KB active"
fi

echo ""
echo "===================="
echo "Health check complete!"
