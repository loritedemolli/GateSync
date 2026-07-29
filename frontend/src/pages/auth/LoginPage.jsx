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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 40%, #0a1628 100%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            width: `${[3, 4, 2, 5, 3, 4][i]}px`,
            height: `${[3, 4, 2, 5, 3, 4][i]}px`,
            background: "#22c55e",
            opacity: [0.4, 0.2, 0.5, 0.15, 0.3, 0.25][i],
            top: `${[15, 70, 35, 80, 20, 55][i]}%`,
            left: `${[20, 75, 85, 15, 50, 40][i]}%`,
          }}
        />
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 0 40px rgba(34,197,94,0.4)",
            }}
          >
            GS
          </div>
          <h1
            className="text-2xl font-black text-white"
            style={{ letterSpacing: "-0.5px" }}
          >
            GateSync
          </h1>
          <p
            className="text-xs font-semibold mt-1"
            style={{ color: "#4ade80" }}
          >
            Neighborhood Management
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="mb-7">
            <h2 className="text-xl font-black text-white mb-1">Welcome back</h2>
            <p
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.4)", fontWeight: "500" }}
            >
              Sign in to your account
            </p>
          </div>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
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
                    color: "rgba(255,255,255,0.25)",
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
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.06)",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    outline: "none",
                    transition: "all 0.15s",
                    boxSizing: "border-box",
                    fontFamily: "system-ui, sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(34,197,94,0.5)";
                    e.target.style.background = "rgba(34,197,94,0.05)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
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
                    color: "rgba(255,255,255,0.25)",
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
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.06)",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    outline: "none",
                    transition: "all 0.15s",
                    boxSizing: "border-box",
                    fontFamily: "system-ui, sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(34,197,94,0.5)";
                    e.target.style.background = "rgba(34,197,94,0.05)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
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
                    color: "rgba(255,255,255,0.3)",
                    display: "flex",
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
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all"
              style={{
                background: loading
                  ? "rgba(34,197,94,0.4)"
                  : "linear-gradient(135deg, #22c55e, #15803d)",
                boxShadow: loading ? "none" : "0 4px 24px rgba(34,197,94,0.35)",
                fontSize: "14px",
                marginTop: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          </div>

          <p
            className="text-center text-sm"
            style={{ color: "rgba(255,255,255,0.35)", fontWeight: "500" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#4ade80",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
