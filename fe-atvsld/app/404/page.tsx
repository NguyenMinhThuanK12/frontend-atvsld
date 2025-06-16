'use client';

import React from 'react'
import Cookies from "js-cookie";
import { refreshToken } from '@/libs/atvsld/services/api/authApi';

export default function page() {
  const callRefreshToken = async () => {
    const refresh_token = Cookies.get("refreshToken");
    if (!refresh_token) {
      console.log("Refresh token not found");
      
      return;
    }
    const access_token = Cookies.get("accessToken");
    console.log("Access token:", access_token);
    
    try {
      const response = await refreshToken(refresh_token);
      if (response.status !== 200 || !response.data?.access_token) {
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        
        console.log("Failed to refresh token:", response.message);
        Cookies.remove("refreshToken");
        Cookies.remove("accessToken");
        return;
        // redirect("/auth/login");
      }
      Cookies.set("accessToken", response.data.access_token);
      const newAccessToken = Cookies.get("accessToken");
      console.log("New access token:", newAccessToken);
    } catch (error) {
      console.log("Error refreshing token:", error);
      
    }
  }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">
            404 - Page Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You don’t have permission to access this page or it doesn’t exist.
          </p>
          <button
            onClick={callRefreshToken}
            className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
 
}
