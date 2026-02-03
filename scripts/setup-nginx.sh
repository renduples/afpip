#!/bin/bash
set -e

echo "🔧 Setting up Nginx for AFPI..."

# Detect nginx config directory
if [ -d "/usr/local/etc/nginx/servers" ]; then
    NGINX_DIR="/usr/local/etc/nginx/servers"
elif [ -d "/etc/nginx/sites-available" ]; then
    NGINX_DIR="/etc/nginx/sites-available"
elif [ -d "/etc/nginx/conf.d" ]; then
    NGINX_DIR="/etc/nginx/conf.d"
else
    echo "❌ Could not find nginx config directory"
    echo "Please manually copy nginx.conf to your nginx configuration directory"
    exit 1
fi

echo "Found nginx directory: $NGINX_DIR"

# Copy config
echo "Copying configuration..."
sudo cp nginx.conf "$NGINX_DIR/afpi.conf"

# If using sites-available, create symlink
if [ -d "/etc/nginx/sites-enabled" ]; then
    echo "Creating symlink in sites-enabled..."
    sudo ln -sf "$NGINX_DIR/afpi.conf" /etc/nginx/sites-enabled/afpi.conf
fi

# Create log directory if it doesn't exist
if [ -d "/usr/local/var/log/nginx" ]; then
    LOG_DIR="/usr/local/var/log/nginx"
else
    LOG_DIR="/var/log/nginx"
fi
sudo mkdir -p "$LOG_DIR"

# Test nginx configuration
echo ""
echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo ""
    echo "Reloading nginx..."
    if command -v brew &> /dev/null && brew services list | grep -q nginx; then
        brew services restart nginx
        echo "✅ Nginx restarted via Homebrew"
    else
        sudo nginx -s reload 2>/dev/null || sudo systemctl reload nginx
        echo "✅ Nginx reloaded"
    fi
    
    echo ""
    echo "✅ Nginx is configured for AFPI!"
    echo ""
    echo "Access the application at:"
    echo "  http://localhost"
    echo "  http://localhost/api/v1/docs (API Documentation)"
    echo ""
    echo "Make sure both services are running:"
    echo "  Backend:  http://localhost:8000"
    echo "  Frontend: http://localhost:3000"
else
    echo "❌ Nginx configuration test failed"
    echo "Please check the configuration manually"
    exit 1
fi
