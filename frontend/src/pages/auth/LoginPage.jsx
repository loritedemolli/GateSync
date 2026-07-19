import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import api from "../../services/api";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username) return setError("Username is required!");
    if (!password) return setError("Password is required!");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(to right, #052e16 0%, #14532d 50%, #1a6b3c 100%)",
      }}
    >
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1">
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 8px 24px rgba(34,197,94,0.5)",
            }}
          >
            GS
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">GateSync</h1>
            <p className="text-green-400 text-sm font-medium">
              Neighborhood Management
            </p>
          </div>
        </div>
        <h2 className="text-5xl font-black text-white leading-tight mb-6">
          Manage your
          <br />
          <span style={{ color: "#4ade80" }}>neighborhood</span>
          <br />
          smarter.
        </h2>
        <p className="text-green-300 text-lg leading-relaxed max-w-md">
          A complete solution for residents, payments, reservations and more —
          all in one place.
        </p>
        <div className="flex gap-2 mt-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === 0 ? "24px" : "8px",
                height: "8px",
                background: i === 0 ? "#22c55e" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right side */}
      <div
        className="flex items-center justify-center w-full lg:flex-1 p-6"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        <div className="w-full max-w-sm">
          {/* Card */}
          <div
            className="rounded-3xl p-9"
            style={{
              background: "#ffffff",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header centered */}
            <div className="mb-8 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
                }}
              >
                <MdLock size={22} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.2",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  fontWeight: "500",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Sign in to continue to GateSync
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  Username
                </label>
                <div className="relative">
                  <MdPerson
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#cbd5e1",
                    }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    style={{
                      width: "100%",
                      paddingLeft: "40px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#0f172a",
                      outline: "none",
                      transition: "all 0.15s",
                      boxSizing: "border-box",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.background = "#f0fdf4";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34,197,94,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f8fafc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  Password
                </label>
                <div className="relative">
                  <MdLock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#cbd5e1",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: "100%",
                      paddingLeft: "40px",
                      paddingRight: "44px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#0f172a",
                      outline: "none",
                      transition: "all 0.15s",
                      boxSizing: "border-box",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.background = "#f0fdf4";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34,197,94,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.background = "#f8fafc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={18} />
                    ) : (
                      <MdVisibility size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background: loading
                    ? "#86efac"
                    : "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(34,197,94,0.4)",
                  transition: "all 0.2s",
                  letterSpacing: "0.01em",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divide */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "20px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#cbd5e1",
                }}
              >
                OR
              </span>
              <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#94a3b8",
                fontWeight: "500",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#16a34a",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Create one
              </Link>
            </p>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              marginTop: "20px",
              fontWeight: "500",
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
