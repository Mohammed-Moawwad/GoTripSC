# 🔐 GoTrip Authentication API - Testing Guide

## 📋 Overview

The authentication system is now live! This guide shows you how to test all the authentication endpoints.

**Base URL:** `http://localhost:3000/api/auth`

---

## 🎯 Available Endpoints

### 1. **User Signup (Registration)**

- **URL:** `POST /api/auth/signup`
- **Description:** Creates a new user account
- **Authentication:** Not required

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "birth_date": "1990-01-15",
  "password": "securePassword123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 7,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "birth_date": "1990-01-15",
      "role": "user",
      "status": "Active"
    }
  }
}
```

**PowerShell Test Command:**

```powershell
$body = @{
    first_name = "John"
    last_name = "Doe"
    email = "john.doe@example.com"
    phone = "+1234567890"
    birth_date = "1990-01-15"
    password = "securePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

---

### 2. **User Login**

- **URL:** `POST /api/auth/login`
- **Description:** Authenticates user and returns JWT token
- **Authentication:** Not required

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 7,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "birth_date": "1990-01-15",
      "role": "user",
      "status": "Active",
      "registered_date": "2025-11-04T12:30:45.000Z"
    }
  }
}
```

**PowerShell Test Command:**

```powershell
$body = @{
    email = "john.doe@example.com"
    password = "securePassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

---

### 3. **Get Current User Profile**

- **URL:** `GET /api/auth/me`
- **Description:** Returns logged-in user's information
- **Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 7,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "birth_date": "1990-01-15",
      "status": "Active",
      "role": "user",
      "registered_date": "2025-11-04T12:30:45.000Z",
      "last_login": "2025-11-04T14:22:10.000Z"
    }
  }
}
```

**PowerShell Test Command:**

```powershell
$token = "your_jwt_token_here"
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -Headers $headers
```

---

### 4. **Update User Profile**

- **URL:** `PUT /api/auth/profile`
- **Description:** Updates logged-in user's information
- **Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+9876543210",
  "birth_date": "1990-01-15"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "user_id": 7,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.doe@example.com",
      "phone": "+9876543210",
      "birth_date": "1990-01-15",
      "status": "Active",
      "role": "user",
      "registered_date": "2025-11-04T12:30:45.000Z"
    }
  }
}
```

**PowerShell Test Command:**

```powershell
$token = "your_jwt_token_here"
$headers = @{
    "Authorization" = "Bearer $token"
}
$body = @{
    first_name = "John"
    last_name = "Smith"
    phone = "+9876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Put -Headers $headers -Body $body -ContentType "application/json"
```

---

### 5. **Change Password**

- **URL:** `PUT /api/auth/change-password`
- **Description:** Changes user's password
- **Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "currentPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**PowerShell Test Command:**

```powershell
$token = "your_jwt_token_here"
$headers = @{
    "Authorization" = "Bearer $token"
}
$body = @{
    currentPassword = "securePassword123"
    newPassword = "newSecurePassword456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/change-password" -Method Put -Headers $headers -Body $body -ContentType "application/json"
```

---

## 🎬 Complete Testing Workflow

### Step 1: Create a New Account

```powershell
$body = @{
    first_name = "Test"
    last_name = "User"
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
$token = $result.data.token
Write-Host "Token: $token"
```

### Step 2: Use the Token to Access Protected Routes

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

# Get your profile
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method Get -Headers $headers
```

### Step 3: Update Your Profile

```powershell
$updateBody = @{
    first_name = "Updated"
    last_name = "Name"
    phone = "+1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
```

### Step 4: Login Again (Optional)

```powershell
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResult = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$newToken = $loginResult.data.token
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Please provide all required fields: first_name, last_name, email, password"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 409 Conflict (Email already exists)

```json
{
  "success": false,
  "message": "Email already registered. Please use a different email or login."
}
```

### 403 Forbidden (Inactive account)

```json
{
  "success": false,
  "message": "Your account is inactive. Please contact support."
}
```

---

## 🔒 Security Features

1. **Password Hashing:** All passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens:** Tokens expire after 7 days
3. **Email Validation:** Email format is validated before registration
4. **Password Strength:** Minimum 6 characters required
5. **Last Login Tracking:** Updates automatically on each login

---

## 📱 Frontend Integration Notes

### Storing the Token (JavaScript)

```javascript
// After signup/login
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
if (data.success) {
  // Store token in localStorage
  localStorage.setItem("authToken", data.data.token);

  // Store user info
  localStorage.setItem("user", JSON.stringify(data.data.user));
}
```

### Using the Token for Protected Requests

```javascript
const token = localStorage.getItem("authToken");

const response = await fetch("http://localhost:3000/api/auth/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
```

### Checking if User is Logged In

```javascript
function isLoggedIn() {
  const token = localStorage.getItem("authToken");
  return token !== null;
}

// Show/hide UI elements based on login status
if (isLoggedIn()) {
  // Hide Login/Signup buttons
  // Show "My Trips" button
} else {
  // Show Login/Signup buttons
  // Hide "My Trips" button
}
```

### Logout Function

```javascript
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/";
}
```

---

## ✅ What's Working Now

- ✅ User signup/registration
- ✅ User login with email/password
- ✅ JWT token generation (expires in 7 days)
- ✅ Password hashing (bcrypt)
- ✅ Get user profile
- ✅ Update user profile
- ✅ Change password
- ✅ Email uniqueness validation
- ✅ Last login tracking
- ✅ Account status checking

---

## 🎯 Next Steps

1. **Test the APIs** using the PowerShell commands above
2. **Create User Management API** for admin panel (Step 2)
3. **Update Admin User Management Page** to use real data (Step 3)
4. **Create User Dashboard** page (Step 4)
5. **Add "My Trips" button logic** to all pages (Step 5)

---

## 🆘 Need Help?

If you encounter any errors, check:

1. Server is running: `http://localhost:3000/api/health`
2. Database is connected
3. Token is included in Authorization header for protected routes
4. Token format is: `Bearer <token>` (note the space)

Happy testing! 🚀
