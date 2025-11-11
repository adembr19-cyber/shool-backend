# How to Fix JWT_SECRET Error and Test API

## Step 1: Restart the Server

The server needs to be restarted to load the `.env` file.

**Option A: If server is running in terminal**
1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop the server
3. Run `npm run dev` again

**Option B: Quick restart command**
Run this in a new PowerShell window:
```powershell
cd c:\Users\HP\Downloads\cpp
# Stop any running node processes (be careful - this stops all node processes)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
# Start the server
npm run dev
```

## Step 2: Test the API

After restarting, you should see "Server running on port 5000" without errors.

### Quick Test - Copy and paste this in PowerShell:

```powershell
# 1. Register a new user
$body = @{
    name = "Test Admin"
    email = "admin@test.com"
    password = "test123456"
    role = "admin"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST -ContentType "application/json" -Body $body

# You should get a response with a token
Write-Host "Success! Token: $($response.token)" -ForegroundColor Green
Write-Host "User: $($response.user | ConvertTo-Json)" -ForegroundColor Green

# 2. Save the token
$token = $response.token

# 3. Test a protected endpoint (list lessons)
$lessons = Invoke-RestMethod -Uri "http://localhost:5000/api/lessons" `
    -Method GET -Headers @{ Authorization = "Bearer $token" }

Write-Host "Lessons: $($lessons | ConvertTo-Json)" -ForegroundColor Cyan
```

## Step 3: Verify .env File

Make sure your `.env` file contains:
```
JWT_SECRET=my_super_secret_jwt_key_12345
MONGO_URI=mongodb://localhost:27017/schooldb
PORT=5000
STORAGE=local
```

If `JWT_SECRET` is missing or empty, the server will show the error you saw.

