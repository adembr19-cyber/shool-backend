# Testing API from Web Browser

Yes! You can test your API from a web browser in several ways:

## 🌐 Method 1: Browser Developer Console

### Chrome/Edge/Firefox:
1. Open your browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Copy and paste these commands:

### Register a User:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Test Admin",
    email: "admin@test.com",
    password: "test123456",
    role: "admin"
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Registration successful!', data);
    // Save token for later
    window.apiToken = data.token;
    console.log('Token saved! Use window.apiToken in other requests');
  })
  .catch(err => console.error('Error:', err));
```

### Login:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: "admin@test.com",
    password: "test123456"
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Login successful!', data);
    window.apiToken = data.token;
  })
  .catch(err => console.error('Error:', err));
```

### Test Protected Endpoint (after login):
```javascript
fetch('http://localhost:5000/api/lessons', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${window.apiToken}`
  }
})
  .then(res => res.json())
  .then(data => console.log('Lessons:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🌐 Method 2: Online API Testing Tools

### Option A: Postman Web
1. Go to https://web.postman.co/
2. Sign up (free) or sign in
3. Create a new request
4. Set method to `POST`
5. URL: `http://localhost:5000/api/auth/register`
6. Go to **Body** → **raw** → Select **JSON**
7. Paste:
```json
{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "test123456",
  "role": "admin"
}
```
8. Click **Send**

### Option B: Insomnia
1. Go to https://insomnia.rest/download
2. Download and install
3. Create new request → POST to `http://localhost:5000/api/auth/register`
4. Add JSON body and send

### Option C: Hoppscotch (formerly Postwoman)
1. Go to https://hoppscotch.io/
2. Set URL to `http://localhost:5000/api/auth/register`
3. Select **POST**
4. Go to **Body** tab → **JSON**
5. Paste JSON and send

**Note:** Online tools work if your server is accessible. For localhost, you might need to use a browser extension or the DevTools method.

---

## 🌐 Method 3: Simple HTML Test Page

Create a file `test-api.html` in your project and open it in a browser:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Tester</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 800px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        input { padding: 8px; margin: 5px; width: 300px; }
    </style>
</head>
<body>
    <h1>API Tester</h1>
    
    <h2>1. Register User</h2>
    <button onclick="register()">Register Admin User</button>
    <div id="register-result"></div>
    
    <h2>2. Login</h2>
    <input type="email" id="email" placeholder="Email" value="admin@test.com">
    <input type="password" id="password" placeholder="Password" value="test123456">
    <button onclick="login()">Login</button>
    <div id="login-result"></div>
    
    <h2>3. Test Protected Endpoints</h2>
    <button onclick="getLessons()">Get Lessons</button>
    <button onclick="getUsers()">Get Users (Admin)</button>
    <button onclick="getSchool()">Get School Info</button>
    <div id="results"></div>

    <script>
        let token = localStorage.getItem('apiToken');
        if (token) {
            console.log('Saved token found:', token);
        }

        async function register() {
            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: "Test Admin",
                        email: "admin@test.com",
                        password: "test123456",
                        role: "admin"
                    })
                });
                const data = await res.json();
                if (data.token) {
                    token = data.token;
                    localStorage.setItem('apiToken', token);
                    document.getElementById('register-result').innerHTML = 
                        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } else {
                    document.getElementById('register-result').innerHTML = 
                        '<pre style="color:red">' + JSON.stringify(data, null, 2) + '</pre>';
                }
            } catch (err) {
                document.getElementById('register-result').innerHTML = 
                    '<pre style="color:red">Error: ' + err.message + '</pre>';
            }
        }

        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.token) {
                    token = data.token;
                    localStorage.setItem('apiToken', token);
                    document.getElementById('login-result').innerHTML = 
                        '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } else {
                    document.getElementById('login-result').innerHTML = 
                        '<pre style="color:red">' + JSON.stringify(data, null, 2) + '</pre>';
                }
            } catch (err) {
                document.getElementById('login-result').innerHTML = 
                    '<pre style="color:red">Error: ' + err.message + '</pre>';
            }
        }

        async function getLessons() {
            if (!token) {
                alert('Please login or register first!');
                return;
            }
            try {
                const res = await fetch('http://localhost:5000/api/lessons', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                document.getElementById('results').innerHTML = 
                    '<h3>Lessons:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (err) {
                document.getElementById('results').innerHTML = 
                    '<pre style="color:red">Error: ' + err.message + '</pre>';
            }
        }

        async function getUsers() {
            if (!token) {
                alert('Please login or register first!');
                return;
            }
            try {
                const res = await fetch('http://localhost:5000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                document.getElementById('results').innerHTML = 
                    '<h3>Users:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (err) {
                document.getElementById('results').innerHTML = 
                    '<pre style="color:red">Error: ' + err.message + '</pre>';
            }
        }

        async function getSchool() {
            if (!token) {
                alert('Please login or register first!');
                return;
            }
            try {
                const res = await fetch('http://localhost:5000/api/schools', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                document.getElementById('results').innerHTML = 
                    '<h3>School Info:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (err) {
                document.getElementById('results').innerHTML = 
                    '<pre style="color:red">Error: ' + err.message + '</pre>';
            }
        }
    </script>
</body>
</html>
```

---

## 🌐 Method 4: Access from Other Devices on Your Network

If you want to test from your phone or another computer:

1. **Find your computer's local IP address:**
   ```powershell
   ipconfig | Select-String "IPv4"
   ```
   Look for something like `192.168.1.xxx`

2. **Make sure your server binds to all interfaces:**
   Your server already does this (listens on `0.0.0.0` by default).

3. **Allow through Windows Firewall:**
   ```powershell
   New-NetFirewallRule -DisplayName "Node.js API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
   ```

4. **Access from other device:**
   - Open browser on phone/other computer
   - Go to: `http://YOUR_IP:5000/api/auth/register`
   - Example: `http://192.168.1.100:5000/api/auth/register`

---

## 🔍 Quick Browser Test URLs

You can also directly type these in your browser address bar (for GET requests only):

- `http://localhost:5000/api/auth/register` - Will show method not allowed (expected, needs POST)
- `http://localhost:5000/api/lessons` - Will show unauthorized (expected, needs auth token)

To test POST requests, use one of the methods above!

---

## 📝 Summary

✅ **Browser Console** - Easiest for quick tests  
✅ **Online Tools** - Best for full API testing  
✅ **HTML Test Page** - Good for demos/testing  
✅ **Network Access** - Test from other devices  

All methods work because your API has CORS enabled! 🎉

