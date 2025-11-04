# API Documentation

This document provides detailed information about the School Management System API endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Optional message",
  "data": {} // Response data
}
```

## Error Handling

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /api/auth/login
Login to the system.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@school.com",
      "role": "super_admin",
      "campusId": null
    }
  }
}
```

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "username": "newuser",
  "email": "user@school.com",
  "password": "password123",
  "role": "student",
  "campusId": "uuid-of-campus"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt-token",
    "user": { /* user object */ }
  }
}
```

### GET /api/auth/profile
Get current user profile.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@school.com",
    "role": "super_admin",
    "campus": { /* campus object if assigned */ }
  }
}
```

---

## Campus Endpoints

### GET /api/campus
Get all campuses.

**Headers:** Authorization required

**Query Parameters:**
- None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Main Campus",
      "code": "MAIN01",
      "address": "123 Education Street",
      "city": "Cityville",
      "state": "State",
      "country": "Country",
      "phone": "+1234567890",
      "email": "main@school.com",
      "isActive": true
    }
  ]
}
```

### GET /api/campus/:id
Get a specific campus.

**Headers:** Authorization required

**Response:** Single campus object

### POST /api/campus
Create a new campus.

**Headers:** Authorization required (admin or super_admin)

**Request:**
```json
{
  "name": "South Campus",
  "code": "SOUTH01",
  "address": "789 Campus Road",
  "city": "Southville",
  "state": "State",
  "country": "Country",
  "phone": "+1234567892",
  "email": "south@school.com"
}
```

### PUT /api/campus/:id
Update a campus.

**Headers:** Authorization required (admin or super_admin)

**Request:** Partial or full campus object

### DELETE /api/campus/:id
Delete a campus.

**Headers:** Authorization required (super_admin only)

---

## Dashboard Endpoints

### GET /api/dashboard
Get dashboard statistics.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "users": 100,
    "campuses": 3,
    "modules": [
      {
        "name": "student",
        "version": "1.0.0",
        "description": "Student Management",
        "enabled": true
      }
    ],
    "moduleStats": {
      "student": {
        "total": 500,
        "active": 480,
        "inactive": 20
      }
    }
  }
}
```

### GET /api/dashboard/modules
Get loaded modules information.

**Headers:** Authorization required

---

## Student Module

### GET /api/students
Get all students.

**Headers:** Authorization required

**Query Parameters:**
- `campusId` - Filter by campus
- `grade` - Filter by grade
- `class` - Filter by class
- `status` - Filter by status (active, inactive, graduated, transferred)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "grade": "10",
      "class": "A",
      "status": "active",
      "enrollmentDate": "2024-01-15"
    }
  ]
}
```

### GET /api/students/:id
Get a specific student.

### POST /api/students
Create a new student.

**Headers:** Authorization required (admin or teacher)

**Request:**
```json
{
  "userId": "uuid",
  "campusId": "uuid",
  "studentId": "STU001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2008-05-15",
  "gender": "male",
  "grade": "10",
  "class": "A",
  "parentName": "Jane Doe",
  "parentPhone": "+1234567890",
  "parentEmail": "parent@email.com",
  "address": "123 Student Street"
}
```

### PUT /api/students/:id
Update a student.

**Headers:** Authorization required (admin or teacher)

### DELETE /api/students/:id
Delete a student.

**Headers:** Authorization required (admin only)

---

## Teacher Module

### GET /api/teachers
Get all teachers.

**Query Parameters:**
- `campusId` - Filter by campus
- `department` - Filter by department
- `subject` - Filter by subject
- `status` - Filter by status

### GET /api/teachers/:id
Get a specific teacher.

### POST /api/teachers
Create a new teacher.

**Request:**
```json
{
  "userId": "uuid",
  "campusId": "uuid",
  "teacherId": "TCH001",
  "firstName": "Sarah",
  "lastName": "Smith",
  "department": "Mathematics",
  "subject": "Algebra",
  "qualification": "M.Sc. Mathematics",
  "experience": 5,
  "salary": 5000.00
}
```

### PUT /api/teachers/:id
Update a teacher.

### DELETE /api/teachers/:id
Delete a teacher.

---

## Attendance Module

### GET /api/attendance
Get attendance records.

**Query Parameters:**
- `campusId` - Filter by campus
- `studentId` - Filter by student
- `teacherId` - Filter by teacher
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `status` - Filter by status (present, absent, late, excused)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "date": "2024-01-15",
      "status": "present",
      "checkInTime": "08:00:00",
      "remarks": "On time"
    }
  ]
}
```

### POST /api/attendance
Mark attendance.

**Request:**
```json
{
  "campusId": "uuid",
  "studentId": "uuid",
  "date": "2024-01-15",
  "status": "present",
  "checkInTime": "08:00:00",
  "checkOutTime": "15:00:00",
  "remarks": "Optional remarks"
}
```

### PUT /api/attendance/:id
Update attendance record.

### DELETE /api/attendance/:id
Delete attendance record.

---

## Finance Module

### GET /api/finance
Get financial transactions.

**Query Parameters:**
- `campusId` - Filter by campus
- `studentId` - Filter by student
- `transactionType` - Filter by type (fee, salary, expense, income)
- `paymentStatus` - Filter by status (pending, completed, failed, refunded)
- `startDate` - Filter from date
- `endDate` - Filter to date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "transactionType": "fee",
      "category": "tuition",
      "amount": 1000.00,
      "paymentMethod": "cash",
      "paymentStatus": "completed",
      "transactionDate": "2024-01-15"
    }
  ]
}
```

### GET /api/finance/:id
Get a specific transaction.

### POST /api/finance
Create a new transaction.

**Request:**
```json
{
  "campusId": "uuid",
  "studentId": "uuid",
  "transactionType": "fee",
  "category": "tuition",
  "amount": 1000.00,
  "paymentMethod": "cash",
  "paymentStatus": "completed",
  "transactionDate": "2024-01-15",
  "description": "Tuition fee for January"
}
```

### PUT /api/finance/:id
Update a transaction.

### DELETE /api/finance/:id
Delete a transaction.

---

## Module Development Guide

### Creating a New Module

1. Create module directory structure:
```bash
backend/modules/mymodule/
├── manifest.json
├── models/
├── routes/
└── controllers/
```

2. Create manifest.json:
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

3. Create models using Sequelize
4. Create controllers with business logic
5. Create routes and apply middleware
6. Restart the server to load the module

### Module Lifecycle

Modules are loaded on server startup:
1. Module loader scans `backend/modules` directory
2. Reads `manifest.json` for each module
3. Loads models, routes, and controllers
4. Registers routes with Express app
5. Makes module available to the system
