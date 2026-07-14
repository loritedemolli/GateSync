import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username) return setError("Username është i detyrueshëm!");
    if (!password) return setError("Fjalëkalimi është i detyrueshëm!");
    if (password.length < 6)
      return setError("Fjalëkalimi duhet të ketë minimum 6 karaktere!");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data || "Username ose fjalëkalimi është i gabuar!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo dhe Titulli */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            GS
          </div>
          <h1 className="text-3xl font-bold text-gray-800">GateSync</h1>
          <p className="text-gray-500 mt-2">Hyr në llogarinë tënde</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Shkruaj username-in"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fjalëkalimi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Shkruaj fjalëkalimin"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Duke hyrë..." : "Hyr"}
          </button>
        </form>

        {/* Link për Register */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Nuk ke llogari?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Regjistrohu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
