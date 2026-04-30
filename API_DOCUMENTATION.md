# API Documentation

**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token (except public endpoints)

---

## 📑 Table of Contents
- [Public Endpoints](#-public-endpoints)
- [Authenticated Endpoints](#-authenticated-endpoints)
- [Admin-Only Endpoints](#-admin-only-endpoints)
- [Error Responses](#-error-responses)

---

## 🔓 Public Endpoints

No authentication required.

---

### POST `/api/auth/register`

Register a new user account.

**Description:** Creates a new user with email, password, and optional name/role.

**Request Body:**
```json
{
  "email": "string (required, unique)",
  "password": "string (required, min length 6)",
  "name": "string (optional)",
  "role": "string (optional, 'admin' | 'user', default: 'user')"
}
```

**Response (201 Created):**
```json
{
  "message": "User created",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2025-09-18T10:30:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123","name":"John Doe"}'
```

**Errors:**
- `400` – Email already registered
- `400` – Missing email or password

---

### POST `/api/auth/login`

Authenticate user and receive JWT token.

**Description:** Validates credentials and returns a signed JWT token for API access.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

**Errors:**
- `401` – Invalid email or password

---

### GET `/api/products/public`

Retrieve all products (public view).

**Description:** Returns a list of all products without requiring authentication.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop Gaming",
    "category": "Electronics",
    "stock": 10,
    "price": 15000000,
    "created_at": "2025-09-18T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Wireless Mouse",
    "category": "Accessories",
    "stock": 50,
    "price": 250000,
    "created_at": "2025-09-18T10:05:00.000Z"
  }
]
```

**Example cURL:**
```bash
curl http://localhost:3000/api/products/public
```

---

### GET `/api/services/public`

Retrieve all services (public view).

**Description:** Returns a list of all services without requiring authentication.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Web Development",
    "description": "Full-stack website development service",
    "price": 15000000,
    "created_at": "2025-09-18T10:15:00.000Z"
  }
]
```

**Example cURL:**
```bash
curl http://localhost:3000/api/services/public
```

---

### GET `/`

Health check endpoint.

**Description:** Returns simple backend identification string.

**Response (200 OK):**
```
backend: expressjs database: postgresql(local)
```

**Example cURL:**
```bash
curl http://localhost:3000/
```

---

## 🔐 Authenticated Endpoints

Requires valid JWT token in `Authorization` header:
```
Authorization: Bearer <your_token>
```

---

### GET `/api/auth/profile`

Get current user profile.

**Description:** Returns the authenticated user's information extracted from JWT payload.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Example cURL:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/auth/profile
```

**Errors:**
- `401` – Token required / Invalid token / Token expired / Token revoked

---

### POST `/api/auth/logout`

Logout and blacklist current token.

**Description:** Adds the current JWT token to a blacklist, preventing further use.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Errors:**
- `400` – Token required
- `401` – Invalid token
- `500` – Server error

> **Note:** Token blacklist is in-memory (non-persistent). Server restart clears all blacklisted tokens.

---

## 👑 Admin-Only Endpoints

All admin endpoints require:
1. Valid JWT token
2. User role = `'admin'`

---

### GET `/api/auth/users`

List all registered users.

**Description:** Admin can view all user accounts (excluding passwords).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "created_at": "2025-09-18T09:00:00.000Z"
  },
  {
    "id": 2,
    "email": "user@example.com",
    "name": "Regular User",
    "role": "user",
    "created_at": "2025-09-18T10:30:00.000Z"
  }
]
```

**Example cURL:**
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:3000/api/auth/users
```

**Errors:**
- `403` – Forbidden (non-admin user)
- `500` – Failed to fetch users

---

### Products Management (Admin)

#### POST `/api/products`

Create a new product.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (optional, default: 'uncategorized')",
  "stock": "number (optional, default: 0)",
  "price": "number (required)"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Laptop Gaming",
  "category": "Electronics",
  "stock": 10,
  "price": 15000000,
  "created_at": "2025-09-18T10:00:00.000Z"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Gaming","category":"Electronics","stock":10,"price":15000000}'
```

---

#### GET `/api/products`

Get all products.

**Response (200 OK):**
```json
[
  { "id": 1, "name": "...", "category": "...", "stock": 10, "price": 15000000, "created_at": "..." },
  { "id": 2, "name": "...", "category": "...", "stock": 5, "price": 5000000, "created_at": "..." }
]
```

**Example cURL:**
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:3000/api/products
```

---

#### GET `/api/products/:id`

Get single product by ID.

**Path Parameters:**
- `id` – Product ID (integer)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop Gaming",
  "category": "Electronics",
  "stock": 10,
  "price": 15000000,
  "created_at": "2025-09-18T10:00:00.000Z"
}
```

**Example cURL:**
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:3000/api/products/1
```

**Errors:**
- `404` – Product not found

---

#### PUT `/api/products/:id`

Update a product.

**Path Parameters:**
- `id` – Product ID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Product Name",
  "category": "Updated Category",
  "stock": 20,
  "price": 18000000
}
```

**Response (200 OK):**
```json
{
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    "category": "Updated Category",
    "stock": 20,
    "price": 18000000,
    "created_at": "2025-09-18T10:00:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":18000000,"stock":15}'
```

---

#### DELETE `/api/products/:id`

Delete a product.

**Path Parameters:**
- `id` – Product ID

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully",
  "data": {
    "id": 1,
    "name": "Laptop Gaming",
    "category": "Electronics",
    "stock": 10,
    "price": 15000000,
    "created_at": "2025-09-18T10:00:00.000Z"
  }
}
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Services Management (Admin)

All CRUD operations mirror Product endpoints.

#### POST `/api/services`
Create a new service.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "price": "number (optional)"
}
```

#### GET `/api/services`
List all services.

#### GET `/api/services/:id`
Get single service by ID.

#### PUT `/api/services/:id`
Update service.

#### DELETE `/api/services/:id`
Delete service.

**Example cURL - Create Service:**
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Consultation","description":"1-hour consulting","price":1000000}'
```

---

## ❌ Error Responses

All errors follow standard JSON format.

### Standard Error Payload
```json
{
  "error": "Error message describing what went wrong"
}
```

### Error Codes Matrix

| HTTP Code | Condition | Example Message |
|-----------|-----------|-----------------|
| `400` | Email already exists | `"Email already registered"` |
| `400` | Missing required field | (depends on request logic) |
| `401` | No token provided | `"Token required"` |
| `401` | Invalid token | `"Invalid token"` |
| `401` | Token expired | `"Token expired"` |
| `401` | Token blacklisted (logout) | `"Token has been revoked"` |
| `403` | User lacks required role | `"Forbidden"` |
| `404` | Resource not found | `"Product not found"` / `"Service not found"` |
| `500` | Database / server error | `"Failed to fetch products"` / `"Failed to fetch users"` |

**Note:** Some endpoints may return custom error messages; check controller logic for details (`src/*/controller.js`).

---

## 📝 Authentication Flow Example

Complete login → access protected → logout flow:

```bash
# Step 1: Register admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123","name":"Admin","role":"admin"}'

# Step 2: Login (save token)
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}')
TOKEN=$(echo $RESPONSE | jq -r '.token')

# Step 3: Access protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/profile

# Step 4: Access admin endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/products

# Step 5: Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Step 6: Try using token again (will fail)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/profile
# Response: { "error": "Token has been revoked" }
```

---

## 🧪 API Testing with Postman / Insomnia

1. **Create Collection** named "Express PostgreSQL RESTful API"
2. **Set Environment Variables:**
   - `baseUrl` = `http://localhost:3000`
   - `token` = (dynamic)

3. **Pre-request Script** (for authenticated requests):
```javascript
pm.environment.set("token", pm.response.json().token);
```

4. **Auth Header** (for protected requests):
```
Key: Authorization
Value: Bearer {{token}}
```

5. **Request Sequence:**
   - POST Register → capture `token` from response
   - POST Login → update `token`
   - GET Profile → use `token`
   - GET `/api/products` → admin only (use admin token)
   - POST Logout → revoke `token`

---

**END OF API DOCUMENTATION**
