# API Documentation

## Authentication

This API uses JWT tokens for authentication. You need to include the token in the `Authorization` header of your requests to access protected endpoints.

### Login

**Endpoint:** `POST /pengguna/login`

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Login berhasil. Gunakan token ini di header Authorization untuk mengakses endpoint yang dilindungi.",
  "data": {
    "token": "your_jwt_token"
  }
}
```

### Using the Token

Include the token in the `Authorization` header of your requests to access protected endpoints.

**Example:**
```
GET /siswa
Authorization: Bearer your_jwt_token
```

## Endpoints

### GET /siswa

**Description:** Retrieve all students.

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Data siswa berhasil diambil",
  "data": [...]
}
```
