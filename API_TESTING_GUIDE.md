# API Testing Guide

Your backend is running on **http://localhost:5000**

## Quick Test Methods

### 1. Using PowerShell (curl)
### 2. Using Postman/Insomnia
### 3. Using a Browser (GET requests only)
### 4. Using the test suite

---

## API Endpoints

### Authentication Endpoints

#### Register a New User
```powershell
# Register as Admin
$body = @{
    name = "Admin User"
    email = "admin@school.com"
    password = "password123"
    role = "admin"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d $body

# Register as Teacher
$body = @{
    name = "John Teacher"
    email = "teacher@school.com"
    password = "password123"
    role = "teacher"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d $body

# Register as Student
$body = @{
    name = "Jane Student"
    email = "student@school.com"
    password = "password123"
    role = "student"
} | ConvertTo-Json

curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d $body
```

#### Login
```powershell
$body = @{
    email = "admin@school.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Save the token for later use
$token = $response.token
Write-Host "Token: $token"
```

---

### Lessons Endpoints (Requires Authentication)

#### Create a Lesson (Admin/Teacher only)
```powershell
$body = @{
    title = "Math Fundamentals"
    description = "Introduction to algebra"
    teacher = "teacher-id-here"  # Use teacher's user ID
    date = "2024-12-25T10:00:00Z"
    recordingUrl = "https://example.com/recording.mp4"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/lessons" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $body
```

#### List Lessons (Authenticated users)
```powershell
# Get all lessons
Invoke-RestMethod -Uri "http://localhost:5000/api/lessons" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }

# With pagination and filters
Invoke-RestMethod -Uri "http://localhost:5000/api/lessons?page=1&limit=10&teacher=teacher-id" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

#### Delete a Lesson (Admin or Lesson's Teacher)
```powershell
$lessonId = "lesson-id-here"

Invoke-RestMethod -Uri "http://localhost:5000/api/lessons/$lessonId" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer $token" }
```

---

### School Endpoints (Requires Authentication)

#### Get School Info
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/schools" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

#### Update School Info (Admin only)
```powershell
$body = @{
    name = "Updated School Name"
    address = "123 Main St"
    phone = "555-0100"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/schools" `
  -Method PUT `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $body
```

---

### User Management Endpoints (Admin only)

#### List All Users
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

#### Create User
```powershell
$body = @{
    name = "New Teacher"
    email = "newteacher@school.com"
    password = "password123"
    role = "teacher"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $body
```

#### Update User
```powershell
$userId = "user-id-here"
$body = @{
    name = "Updated Name"
    email = "updated@school.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users/$userId" `
  -Method PUT `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $body
```

#### Delete User
```powershell
$userId = "user-id-here"

Invoke-RestMethod -Uri "http://localhost:5000/api/users/$userId" `
  -Method DELETE `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:5000`
3. **Set Environment Variable**: 
   - Create an environment variable `base_url` = `http://localhost:5000`
   - Create `token` variable to store JWT token
4. **Authorization**: 
   - For protected routes, go to Authorization tab
   - Select "Bearer Token" type
   - Use `{{token}}` as the token value

### Example Postman Setup:
- **Register**: POST `{{base_url}}/api/auth/register`
- **Login**: POST `{{base_url}}/api/auth/login` → Save token to environment
- **List Lessons**: GET `{{base_url}}/api/lessons` (with Bearer token)

---

## Quick Test Script

Save the following as `test-api.ps1` and run it:

```powershell
$baseUrl = "http://localhost:5000"

# 1. Register an admin user
Write-Host "`n=== Registering Admin User ===" -ForegroundColor Cyan
$registerBody = @{
    name = "Test Admin"
    email = "admin@test.com"
    password = "test123456"
    role = "admin"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "Token: $($registerResponse.token)" -ForegroundColor Yellow
    $token = $registerResponse.token
} catch {
    Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 2. Login
Write-Host "`n=== Logging In ===" -ForegroundColor Cyan
$loginBody = @{
    email = "admin@test.com"
    password = "test123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    $token = $loginResponse.token
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. Get School Info
Write-Host "`n=== Getting School Info ===" -ForegroundColor Cyan
try {
    $schoolInfo = Invoke-RestMethod -Uri "$baseUrl/api/schools" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✓ School info retrieved!" -ForegroundColor Green
    Write-Host ($schoolInfo | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "✗ Failed to get school info: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. List Lessons
Write-Host "`n=== Listing Lessons ===" -ForegroundColor Cyan
try {
    $lessons = Invoke-RestMethod -Uri "$baseUrl/api/lessons" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✓ Lessons retrieved!" -ForegroundColor Green
    Write-Host "Total lessons: $($lessons.length)"
    Write-Host ($lessons | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "✗ Failed to list lessons: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. List Users (Admin only)
Write-Host "`n=== Listing Users ===" -ForegroundColor Cyan
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✓ Users retrieved!" -ForegroundColor Green
    Write-Host "Total users: $($users.length)"
} catch {
    Write-Host "✗ Failed to list users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
```

---

## Run Automated Tests

You can also run the existing Jest test suite:

```powershell
npm test
```

---

## Common Issues

1. **401 Unauthorized**: Make sure you're including the Bearer token in the Authorization header
2. **400 Bad Request**: Check that required fields are included and properly formatted
3. **500 Server Error**: Check server logs for detailed error messages
4. **MongoDB Connection Error**: Ensure MongoDB is running (`mongod` process)

---

## Using Browser DevTools

For GET requests, you can test directly in the browser console:

```javascript
// Note: This only works for GET requests that don't require auth
// For auth-protected routes, use Postman or curl

fetch('http://localhost:5000/api/lessons', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

