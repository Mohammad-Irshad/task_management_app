import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const accessToken = localStorage.getItem('accessToken')

    // If no access token exists, redirect to the login page
    if (!accessToken) {
        return <Navigate to="/" replace />
    }
    try {
        // Decode the JWT token
        const decodedToken = jwtDecode(accessToken)
        const currentTime = Date.now() / 1000

        // Check if the token has expired
        if (decodedToken.exp < currentTime) {
            
            localStorage.removeItem('accessToken')
            return <Navigate to="/" replace />;
        }
        return children;
    } catch (error) {        
        localStorage.removeItem('accessToken')
        return <Navigate to="/" replace />
    }
};

export default ProtectedRoute;
