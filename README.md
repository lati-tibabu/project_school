# School Management System

A modular, scalable School Management System built with Node.js, Express, Sequelize (PostgreSQL), and React.

## Features

### Core System
- **JWT-based Authentication**: Secure authentication with JSON Web Tokens
- **Role-Based Access Control (RBAC)**: Support for multiple roles (super_admin, admin, teacher, student, parent)
- **Multi-Campus Management**: Manage multiple school campuses from a single system
- **Centralized Dashboard**: Overview of system statistics and module data
- **Dynamic Module Loading**: Add or remove modules without modifying core system

### Modular Architecture
The system supports dynamic module loading with the following structure:
- Each module contains: models, routes, controllers, and a manifest file
- Modules can be enabled/disabled through their manifest
- Modules can declare dependencies on other modules
- Centralized Sequelize configuration shared across all modules

### Available Modules
1. **Student Management**: Manage student information, enrollment, and records
2. **Teacher Management**: Handle teacher profiles, assignments, and departments
3. **Attendance Management**: Track student and teacher attendance
4. **Finance Management**: Manage fees, payments, and financial transactions

## Architecture

```
project_school/
├── backend/
│   ├── config/
│   │   ├── database.js          # Centralized Sequelize configuration
│   │   └── moduleLoader.js      # Dynamic module loader
│   ├── core/
│   │   ├── models/              # Core models (User, Campus)
│   │   ├── routes/              # Core routes (auth, campus, dashboard)
│   │   └── controllers/         # Core controllers
│   ├── middleware/
│   │   └── auth.js              # JWT authentication & authorization
│   ├── modules/
│   │   ├── student/
│   │   │   ├── manifest.json    # Module configuration
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── controllers/
│   │   ├── teacher/
│   │   ├── attendance/
│   │   └── finance/
│   └── server.js                # Main server file
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/               # Login, Dashboard
    │   ├── services/            # API services
    │   └── context/             # Auth context
    └── public/
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd project_school
```

2. Install backend dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

4. Create PostgreSQL database:
```bash
createdb school_management
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Body: { username, password }
Response: { token, user }
```

#### Register
```
POST /api/auth/register
Body: { username, email, password, role?, campusId? }
Response: { token, user }
```

#### Get Profile
```
GET /api/auth/profile
Headers: { Authorization: Bearer <token> }
Response: { user }
```

### Campus Endpoints
```
GET    /api/campus          # Get all campuses
GET    /api/campus/:id      # Get single campus
POST   /api/campus          # Create campus (admin only)
PUT    /api/campus/:id      # Update campus (admin only)
DELETE /api/campus/:id      # Delete campus (super_admin only)
```

### Dashboard Endpoints
```
GET /api/dashboard          # Get dashboard statistics
GET /api/dashboard/modules  # Get loaded modules info
```

### Module Endpoints

#### Students
```
GET    /api/students        # Get all students
GET    /api/students/:id    # Get single student
POST   /api/students        # Create student
PUT    /api/students/:id    # Update student
DELETE /api/students/:id    # Delete student
```

#### Teachers
```
GET    /api/teachers        # Get all teachers
GET    /api/teachers/:id    # Get single teacher
POST   /api/teachers        # Create teacher
PUT    /api/teachers/:id    # Update teacher
DELETE /api/teachers/:id    # Delete teacher
```

#### Attendance
```
GET    /api/attendance      # Get attendance records
POST   /api/attendance      # Mark attendance
PUT    /api/attendance/:id  # Update attendance
DELETE /api/attendance/:id  # Delete attendance
```

#### Finance
```
GET    /api/finance         # Get transactions
GET    /api/finance/:id     # Get single transaction
POST   /api/finance         # Create transaction
PUT    /api/finance/:id     # Update transaction
DELETE /api/finance/:id     # Delete transaction
```

## Creating a New Module

1. Create module directory structure:
```bash
mkdir -p backend/modules/mymodule/{models,routes,controllers}
```

2. Create `manifest.json`:
```json
{
  "name": "My Module",
  "version": "1.0.0",
  "description": "Module description",
  "enabled": true,
  "basePath": "/api/mymodule",
  "dependencies": [],
  "permissions": ["mymodule.view", "mymodule.create"]
}
```

3. Create models, routes, and controllers following the existing module patterns.

4. Restart the server - the module will be automatically loaded!

## Module Management

### Enabling/Disabling Modules
Edit the module's `manifest.json` and set `enabled` to `true` or `false`, then restart the server.

### Module Dependencies
Declare dependencies in the manifest:
```json
{
  "dependencies": ["student", "teacher"]
}
```

## User Roles

- **super_admin**: Full system access
- **admin**: Campus-level administration
- **teacher**: Teaching and attendance management
- **student**: Limited access to own data
- **parent**: Access to children's data

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation
- SQL injection protection via Sequelize ORM

## Development

### Running Tests
```bash
npm test
```

### Building Frontend
```bash
cd frontend
npm run build
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure PostgreSQL with proper credentials
4. Build the frontend: `cd frontend && npm run build`
5. Use a process manager like PM2: `pm2 start backend/server.js`
6. Set up a reverse proxy (nginx/Apache)
7. Enable HTTPS with SSL certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
