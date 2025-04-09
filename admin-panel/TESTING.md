# Vastrashahi Admin Panel Testing Guide

## Prerequisites
- Node.js (v14 or later)
- MongoDB running locally or a connection to a remote MongoDB instance
- Backend server running on port 8000

## Setup and Testing Process

### Step 1: Start the Backend Server
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies if needed:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   npm run start-dev
   ```
4. Verify that the backend is running on port 8000 and connected to MongoDB

### Step 2: Start the Admin Panel
1. Navigate to the admin-panel directory:
   ```
   cd admin-panel
   ```
2. Install dependencies if needed:
   ```
   npm install
   ```
3. Start the admin panel on port 5000:
   ```
   npm run dev -- -p 5000
   ```
4. Alternatively, use the start script:
   ```
   ./start.bat   # Windows
   ```
   or
   ```
   cd scripts && ./start-dev.bat   # Using the provided script
   ```

### Step 3: Test Registration
1. Open your browser and navigate to: [http://localhost:5000](http://localhost:5000)
2. Click on "Register" to create a new admin account
3. Fill in the registration form:
   - **Name**: Your full name (e.g., "Admin User")
   - **Email**: A valid email format that hasn't been used before (e.g., "newadmin@example.com")
   - **Password**: At least 6 characters (e.g., "password123")
   - **Confirm Password**: Same as password field
   - **Role**: Select from dropdown (Admin, Manager, CEO, Super Admin)
4. Click "Create account"
5. If successful, you'll be redirected to the dashboard

### Step 4: Test Login
1. If you're already logged in, click "Logout" in the sidebar
2. Go to the login page: [http://localhost:5000/login](http://localhost:5000/login)
3. Enter your email and password from Step 3
4. Click "Sign in"
5. If successful, you'll be redirected to the dashboard

### Step 5: Test Dashboard Features
1. Verify that you can see:
   - Stats cards at the top of the dashboard
   - Recent orders section with mock data
2. Test the sidebar navigation:
   - Click on different menu items
   - Verify that the active menu item is highlighted
3. Test the responsive design:
   - Resize your browser window
   - Verify that the layout adapts to different screen sizes
   - Try the menu toggle on mobile view

## Troubleshooting

### CORS Issues
If you encounter CORS errors in the console:
1. Verify that the backend has the correct CORS configuration:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'http://localhost:5000'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
     exposedHeaders: ['Set-Cookie']
   }));
   ```
2. Make sure you restart the backend after making changes

### Registration Errors
1. **"This Email already Added!"**: Try a different email address
2. **Network Errors**: Check if the backend is running and accessible
3. **Validation Errors**: Make sure all form fields meet the requirements

### Dashboard Errors
If you see errors in the dashboard after login:
1. Check the browser console for specific error messages
2. Verify that the mock data is properly formatted
3. Try refreshing the page or logging out and back in

## Notes for Developers
- The admin panel uses the Next.js API proxy to avoid CORS issues
- User authentication state is stored in localStorage
- Mock data is used for the dashboard until backend integration is complete 