# Quick API Test Script
# Run with: .\test-api.ps1

$baseUrl = "http://localhost:5000"

Write-Host ""
Write-Host "=== Testing School Tutoring Backend API ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Gray
Write-Host ""

# 1. Register an admin user
Write-Host "1. Registering Admin User..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test Admin"
    email = "admin@test.com"
    password = "test123456"
    role = "admin"
} | ConvertTo-Json

$token = $null
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "   [OK] Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "   Role: $($registerResponse.user.role)" -ForegroundColor Gray
    $token = $registerResponse.token
    $userId = $registerResponse.user.id
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   [!] User may already exist, trying login instead..." -ForegroundColor Yellow
    } else {
        Write-Host "   [ERROR] Registration failed: $($_.Exception.Message)" -ForegroundColor Red
        exit
    }
}

# 2. Login (if registration failed, try this)
if (-not $token) {
    Write-Host ""
    Write-Host "2. Logging In..." -ForegroundColor Yellow
    $loginBody = @{
        email = "admin@test.com"
        password = "test123456"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $loginBody
        
        Write-Host "   [OK] Login successful!" -ForegroundColor Green
        $token = $loginResponse.token
        $userId = $loginResponse.user.id
    } catch {
        Write-Host "   [ERROR] Login failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Please register a user first or check credentials" -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host ""
    Write-Host "2. Skipping login (already have token from registration)" -ForegroundColor Gray
}

if (-not $token) {
    Write-Host "[ERROR] No authentication token available. Exiting." -ForegroundColor Red
    exit
}

# 3. Get School Info
Write-Host ""
Write-Host "3. Getting School Info..." -ForegroundColor Yellow
try {
    $schoolInfo = Invoke-RestMethod -Uri "$baseUrl/api/schools" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "   [OK] School info retrieved!" -ForegroundColor Green
    if ($schoolInfo) {
        Write-Host "   School: $($schoolInfo | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } else {
        Write-Host "   (No school data found)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ERROR] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. List Lessons
Write-Host ""
Write-Host "4. Listing Lessons..." -ForegroundColor Yellow
try {
    $lessons = Invoke-RestMethod -Uri "$baseUrl/api/lessons" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "   [OK] Lessons retrieved!" -ForegroundColor Green
    if ($lessons -is [System.Array]) {
        Write-Host "   Total lessons: $($lessons.length)" -ForegroundColor Gray
    } else {
        Write-Host "   Response: $($lessons | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ERROR] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. List Users (Admin only)
Write-Host ""
Write-Host "5. Listing Users (Admin Only)..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "   [OK] Users retrieved!" -ForegroundColor Green
    if ($users -is [System.Array]) {
        Write-Host "   Total users: $($users.length)" -ForegroundColor Gray
    } else {
        Write-Host "   Response: $($users | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ERROR] Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   (May require admin role)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Testing Complete ===" -ForegroundColor Green
Write-Host "Token saved for this session. Use it for further API testing." -ForegroundColor Gray
if ($token) {
    Write-Host "Token: $token" -ForegroundColor DarkGray
}
