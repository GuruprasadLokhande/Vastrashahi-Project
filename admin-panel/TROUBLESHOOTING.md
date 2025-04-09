# Troubleshooting Guide for Vastrashahi Admin Panel

## Sidebar Not Visible

If the sidebar is not visible:

1. Make sure you are logged in. The sidebar is only displayed after successful authentication.
2. Check that the `Layout` component is correctly passing the `isSidebarOpen` prop to the `Sidebar` component.
3. Try refreshing the page while logged in.
4. Clear browser cache and reload.

## Login/Registration Issues

If you're having trouble logging in or registering:

1. Make sure the backend server is running on port 8000
2. Check that your CORS settings in the backend allow requests from http://localhost:5000
3. For registration errors about "Email already added", try using a new email address
4. Verify that your password is at least 6 characters long
5. Check browser console (F12) for specific error messages

## Products Not Loading

If products aren't loading in the products page:

1. Ensure your backend server is running
2. Check console for API errors
3. Verify your API endpoints match what's being called from the admin panel
4. Check that you're properly authenticated - your token might be expired

## Image Upload Not Working

If you can't upload images:

1. Verify that Cloudinary or your image storage service is properly configured
2. Check file size limits - images should be under 10MB
3. Make sure you're using supported image formats (JPG, PNG, GIF)

## Dashboard Data Not Showing

If dashboard statistics or recent orders are not appearing:

1. This is likely using mock data until connected to the real backend
2. Check your API service configuration for dashboard endpoints
3. Verify the backend has routes for dashboard statistics

## General Fixes

These general fixes can resolve many common issues:

1. **Clear browser cache**: Press Ctrl+F5 or Cmd+Shift+R to perform a hard refresh
2. **Clear localStorage**: 
   - Open browser dev tools (F12)
   - Go to Application > Storage > Local Storage
   - Clear the items for your domain
3. **Restart both servers**:
   - Stop and restart your backend server
   - Stop and restart your admin panel dev server
4. **Check correct ports**:
   - Backend should run on port 8000
   - Admin panel should run on port 5000

For persistent issues, check the backend logs for errors that might not be visible in the frontend. 