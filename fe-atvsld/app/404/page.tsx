import React from 'react'

export default function page() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">
            404 - Page Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You don’t have permission to access this page or it doesn’t exist.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
}
