#!/bin/bash
set -e

echo "🗄️  Initializing MariaDB database..."

# Wait for MariaDB to be ready
echo "Waiting for MariaDB to start..."
sleep 5

# Check if MariaDB is ready
until docker-compose exec mariadb mysqladmin ping -h localhost --silent; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done

echo "✅ MariaDB is ready!"

# Create tables using SQLAlchemy
echo "Creating database tables..."
cd backend/api-gateway
python3 << EOF
from app.db.database import Base, engine
from app.db.models import DataSource, Agent, Taxonomy, Analysis

try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")
    exit(1)
EOF

cd ../..

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "You can connect to MariaDB with:"
echo "  docker-compose exec mariadb mysql -u afpi -pafpi afpi"
