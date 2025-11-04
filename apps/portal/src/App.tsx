import { useState, useEffect } from 'react';

interface ApiStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  database: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get API URL based on environment
  const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://api.makesoft.io');
  const authUrl = import.meta.env.VITE_AUTH_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'https://auth.makesoft.io');
  const landingUrl = import.meta.env.VITE_LANDING_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://makesoft.io');

  useEffect(() => {
    // Check for auth token in URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Fetch API status
    fetch(`${apiUrl}/v1/status`)
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to connect to API');
        setLoading(false);
        console.error(err);
      });

    // Fetch user if token exists
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetch(`${authUrl}/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setUser(data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Makesoft Portal</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href={`${authUrl}/login`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">API Status</h3>
                {apiStatus && (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Service:</span> {apiStatus.service}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`px-2 py-1 rounded ${
                        apiStatus.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {apiStatus.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Database:</span>{' '}
                      <span className={`px-2 py-1 rounded ${
                        apiStatus.database === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {apiStatus.database}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Version:</span> {apiStatus.version}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">User Info</h3>
                {user ? (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Username:</span> {user.username}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{' '}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {user.role}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Not logged in. <a href={`${authUrl}/login`} className="text-indigo-600 hover:underline">Login here</a>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://forum.makesoft.io/threads"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold mb-2">Forum</h4>
                <p className="text-sm text-gray-600">Browse discussions</p>
              </a>
              <a
                href={`${apiUrl}/v1/status`}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4 className="font-semibold mb-2">API</h4>
                <p className="text-sm text-gray-600">Check API status</p>
              </a>
              <a
                href={landingUrl}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold mb-2">Home</h4>
                <p className="text-sm text-gray-600">Back to landing</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
