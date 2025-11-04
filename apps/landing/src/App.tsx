function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Makesoft
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build amazing software with our comprehensive platform
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://auth.makesoft.io/login"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login
            </a>
            <a
              href="https://auth.makesoft.io/register"
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign Up
            </a>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Fast & Secure</h2>
              <p className="text-gray-600">
                Built with modern technologies for speed and security
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Easy Integration</h2>
              <p className="text-gray-600">
                Simple APIs and comprehensive documentation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Community</h2>
              <p className="text-gray-600">
                Join our forum and connect with developers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
