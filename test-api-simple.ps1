# Simple API Test - Manual Commands
# Copy and paste these commands one by one in PowerShell

$baseUrl = "http://localhost:5000"

Write-Host "=== Simple API Testing ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Register a user (copy and run this):" -ForegroundColor Yellow
Write-Host ""
Write-Host '$body = @{'
Write-Host '    name = "Test Admin"'
Write-Host '    email = "admin@test.com"'
Write-Host '    password = "test123456"'
Write-Host '    role = "admin"'
Write-Host '} | ConvertTo-Json'
Write-Host ""
Write-Host 'Invoke-RestMethod -Uri "' + $baseUrl + '/api/auth/register" -Method POST -ContentType "application/json" -Body $body'
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Login (save the token from registration first):" -ForegroundColor Yellow
Write-Host ""
Write-Host '$loginBody = @{'
Write-Host '    email = "admin@test.com"'
Write-Host '    password = "test123456"'
Write-Host '} | ConvertTo-Json'
Write-Host ""
Write-Host '$response = Invoke-RestMethod -Uri "' + $baseUrl + '/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody'
Write-Host '$token = $response.token'
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test protected endpoint (use token from step 2):" -ForegroundColor Yellow
Write-Host ""
Write-Host 'Invoke-RestMethod -Uri "' + $baseUrl + '/api/lessons" -Method GET -Headers @{ Authorization = "Bearer $token" }'
Write-Host ""

