# User Management API Specification

## Overview
This document describes the REST API endpoints for user management in the ThoaThuyShop identify-service.

**Base URL:** `http://localhost:8080`
**API Version:** v1
**Authentication:** Bearer Token (JWT)

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (min 3 characters)",
  "password": "string (min 8 characters)", 
  "firstname": "string",
  "lastname": "string",
  "dob": "date (YYYY-MM-DD)",
  "gender": "string",
  "roles": ["string"]
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "id": "string (UUID)",
    "username": "string",
    "firstname": "string", 
    "lastname": "string",
    "dob": "date",
    "gender": "string",
    "roles": ["string"]
  }
}
```

### POST /auth/token
Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success", 
  "data": {
    "token": "string (JWT)",
    "authenticated": true
  }
}
```

### POST /auth/introspect
Validate and introspect JWT token.

**Request Body:**
```json
{
  "token": "string (JWT)"
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "valid": true
  }
}
```

## User Management Endpoints

### POST /users/addUser
Create a new user (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "string (min 3 characters)",
  "password": "string (min 8 characters)",
  "firstname": "string",
  "lastname": "string", 
  "dob": "date (YYYY-MM-DD)",
  "gender": "string",
  "roles": ["string"]
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "id": "string (UUID)",
    "username": "string",
    "password": "string (hashed)",
    "firstname": "string",
    "lastname": "string",
    "dob": "date",
    "gender": "string", 
    "roles": ["string"],
    "cart": null,
    "orders": [],
    "reviews": []
  }
}
```

### GET /users/allUsers
Get all users (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": [
    {
      "id": "string (UUID)",
      "username": "string",
      "firstname": "string",
      "lastname": "string",
      "dob": "date",
      "gender": "string",
      "roles": ["string"]
    }
  ]
}
```

### GET /users/{userId}
Get user by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `userId` (string, required): User UUID

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "id": "string (UUID)",
    "username": "string", 
    "firstname": "string",
    "lastname": "string",
    "dob": "date",
    "gender": "string",
    "roles": ["string"]
  }
}
```

### GET /users/myInfo
Get current authenticated user's information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "id": "string (UUID)",
    "username": "string",
    "firstname": "string", 
    "lastname": "string",
    "dob": "date",
    "gender": "string",
    "roles": ["string"]
  }
}
```

### PUT /users/{userId}
Update user information.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `userId` (string, required): User UUID

**Request Body:**
```json
{
  "password": "string (optional)",
  "firstname": "string (optional)",
  "lastname": "string (optional)",
  "dob": "date (optional, YYYY-MM-DD)",
  "gender": "string (optional)",
  "roles": ["string"] (optional)
}
```

**Response:**
```json
{
  "id": "string (UUID)",
  "username": "string",
  "firstname": "string",
  "lastname": "string", 
  "dob": "date",
  "gender": "string",
  "roles": ["string"]
}
```

### DELETE /users/{userId}
Delete user by ID (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `userId` (string, required): User UUID

**Response:**
```json
"User has been deleted"
```

## Data Models

### User Entity
```json
{
  "id": "string (UUID)",
  "username": "string",
  "password": "string (hashed)",
  "firstname": "string",
  "lastname": "string",
  "dob": "date (LocalDate)",
  "gender": "string",
  "roles": ["string"],
  "cart": "Cart (relationship)",
  "orders": ["Order"] (relationship),
  "reviews": ["ProductReview"] (relationship)
}
```

### UserCreationRequest
```json
{
  "username": "string (min 3 characters, required)",
  "password": "string (min 8 characters, required)",
  "firstname": "string",
  "lastname": "string",
  "dob": "date (YYYY-MM-DD)",
  "gender": "string",
  "roles": ["string"]
}
```

### UserUpdateRequest
```json
{
  "password": "string (optional)",
  "firstname": "string (optional)",
  "lastname": "string (optional)",
  "dob": "date (optional, YYYY-MM-DD)",
  "gender": "string (optional)",
  "roles": ["string"] (optional)
}
```

### UserResponse
```json
{
  "id": "string (UUID)",
  "username": "string",
  "firstname": "string",
  "lastname": "string",
  "dob": "date",
  "gender": "string",
  "roles": ["string"],
  "password": "string (optional, only in some contexts)"
}
```

## Error Responses

### Standard Error Response
```json
{
  "code": "number (error code)",
  "message": "string (error message)",
  "data": null
}
```

### Common Error Codes
- `1001`: User invalid (username too short)
- `1002`: Invalid password (password too short)
- `1003`: User not found
- `1004`: Unauthorized access
- `1005`: Forbidden - insufficient permissions

## Security Notes

1. **Authentication Required**: All user management endpoints require valid JWT token
2. **Role-based Access**: 
   - Admin role required for: `GET /users/allUsers`, `POST /users/addUser`, `DELETE /users/{userId}`
   - Users can access their own information via `GET /users/myInfo`
   - Users can update their own profile via `PUT /users/{userId}` (with their own ID)
3. **CORS Configuration**: Currently configured for `http://localhost:3000`
4. **Password Security**: Passwords are hashed before storage
5. **Token Validation**: Use `/auth/introspect` to validate tokens

## Usage Examples

### Register New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123",
    "firstname": "John",
    "lastname": "Doe",
    "dob": "1990-01-01",
    "gender": "Male",
    "roles": ["USER"]
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Get All Users (Admin)
```bash
curl -X GET http://localhost:8080/users/allUsers \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update User Profile
```bash
curl -X PUT http://localhost:8080/users/{userId} \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John Updated",
    "lastname": "Doe Updated"
  }'
``` 