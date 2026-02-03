# AFPI Quick Start (Local MariaDB)

## Prerequisites

- **MariaDB or MySQL** running locally on port 3306
- **Python 3.11+**
- **Node.js 20+**

## Setup

### 1. Configure Database Connection

Edit `.env` file and update the database URL to match your MariaDB setup:

```bash
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/afpi
```

### 2. Create Database

Connect to your MariaDB and create the database:

```sql
CREATE DATABASE afpi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optional: Create dedicated user
CREATE USER 'afpi'@'localhost' IDENTIFIED BY 'afpi';
GRANT ALL PRIVILEGES ON afpi.* TO 'afpi'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Start the Application

```bash
./scripts/start.sh
```

This will:
- Install Python and Node.js dependencies
- Create database tables automatically
- Start the backend API on port 8000
- Start the frontend on port 3000

### 4. Access the Dashboard

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/v1/docs

## Manual Start (Development)

### Backend Only

```bash
cd backend/api-gateway
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

## Verify Database Connection

```bash
cd backend/api-gateway
source venv/bin/activate
python3 -c "
from app.db.database import engine
with engine.connect() as conn:
    print('✅ Database connection successful!')
"
```

## Cloud SQL (Production)

For GCP deployment, the application will automatically use Cloud SQL when configured:

```bash
# Update .env for production
DATABASE_URL=mysql+pymysql://user:password@/dbname?unix_socket=/cloudsql/PROJECT:REGION:INSTANCE
```

The Cloud SQL proxy connection is handled automatically in the GKE deployment.

## Troubleshooting

### Cannot connect to MariaDB

1. Check MariaDB is running:
   ```bash
   mysql -u afpi -pafpi afpi -e "SELECT 1;"
   ```

2. Verify credentials in `.env` match your MariaDB setup

3. Check port 3306 is accessible

### ModuleNotFoundError

```bash
cd backend/api-gateway
source venv/bin/activate
pip install -r requirements.txt
```

### Port already in use

Change ports in the start command:
```bash
# Backend on different port
uvicorn app.main:app --reload --port 8001

# Frontend on different port
PORT=3001 npm run dev
```
