# Quick Start Guide

Get the School Management System up and running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project_school
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Create Database

```bash
# Using psql
createdb school_management

# Or using SQL
psql -U postgres
CREATE DATABASE school_management;
\q
```

### 5. Seed Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- 2 campuses
- 4 users with different roles

**Login Credentials:**
- Super Admin: `admin` / `admin123`
- Campus Admin: `campus_admin` / `admin123`
- Teacher: `teacher1` / `teacher123`
- Student: `student1` / `student123`

### 6. Start Backend Server

```bash
npm start
```

You should see:
```
✓ Database connection established successfully.
✓ Database synchronized successfully.
✓ Loaded module: Student Management v1.0.0
✓ Loaded module: Teacher Management v1.0.0
✓ Loaded module: Attendance Management v1.0.0
✓ Loaded module: Finance Management v1.0.0
✓ Server running on port 5000
```

### 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 8. Start Frontend Development Server

```bash
npm start
```

The frontend will open at http://localhost:3000

## Quick Test

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Frontend

1. Open http://localhost:3000
2. Login with `admin` / `admin123`
3. View the dashboard with statistics

## Common Issues

### Database Connection Failed

**Problem:** Can't connect to PostgreSQL

**Solution:**
1. Ensure PostgreSQL is running: `sudo service postgresql status`
2. Check database credentials in `.env`
3. Verify database exists: `psql -l`

### Port Already in Use

**Problem:** Port 5000 or 3000 already in use

**Solution:**
1. Change `PORT` in `.env` for backend
2. Change port in `frontend/package.json` for frontend
3. Or kill the process using the port

### Module Not Loading

**Problem:** Modules aren't loading on startup

**Solution:**
1. Check `manifest.json` syntax in each module
2. Ensure `enabled: true` in manifest
3. Check server logs for errors

### Tests Failing

**Problem:** Tests fail when running `npm test`

**Solution:**
1. Ensure PostgreSQL is running
2. Check database configuration
3. Review test output for specific errors

## Next Steps

After successful installation:

1. **Explore the Dashboard**
   - View system statistics
   - Check loaded modules

2. **Create Sample Data**
   - Add campuses via `/api/campus`
   - Create students, teachers
   - Mark attendance
   - Create transactions

3. **Read Documentation**
   - `README.md` - Complete overview
   - `API_DOCUMENTATION.md` - API reference
   - `MODULE_DEVELOPMENT_GUIDE.md` - Create new modules

4. **Customize**
   - Modify existing modules
   - Create new modules
   - Customize frontend

## Development Mode

For development with auto-reload:

```bash
# Backend (using nodemon)
npm run dev

# Frontend (already has hot reload)
cd frontend && npm start
```

## Production Deployment

Quick production setup:

```bash
# Set production environment
export NODE_ENV=production

# Build frontend
cd frontend && npm run build

# Start backend with PM2
pm2 start backend/server.js --name school-management

# Set up nginx reverse proxy
# Enable HTTPS with Let's Encrypt
```

See README.md for detailed production deployment instructions.

## Testing

Run tests:

```bash
npm test
```

All tests should pass:
```
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
```

## Support

For issues:
1. Check the documentation
2. Review server logs
3. Check database connections
4. Verify module configurations

## Success!

You now have a fully functional School Management System running locally. Start exploring the features and building your custom modules!

### API Access
- Base URL: http://localhost:5000/api
- Health: http://localhost:5000/health

### Available Endpoints
- `/api/auth/*` - Authentication
- `/api/campus/*` - Campus management
- `/api/dashboard/*` - Dashboard
- `/api/students/*` - Student management
- `/api/teachers/*` - Teacher management
- `/api/attendance/*` - Attendance
- `/api/finance/*` - Finance

Happy coding! 🚀
