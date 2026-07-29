import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdPerson,
  MdLock,
  MdEmail,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import api from "../../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    roleId: 3,
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.fullName) return "Full Name is required!";
    if (formData.fullName.length < 5)
      return "Full Name must be at least 5 characters!";
    if (!/^[a-zA-ZëËçÇ\s]+$/.test(formData.fullName))
      return "Full Name must contain only letters!";
    if (!formData.username) return "Username is required!";
    if (formData.username.length < 6)
      return "Username must be at least 6 characters!";
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      return "Username can only contain letters, numbers and _!";
    if (!formData.email) return "Email is required!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Email is not valid!";
    if (!formData.phoneNumber) return "Phone Number is required!";
    if (!/^[+]?[0-9]{9,15}$/.test(formData.phoneNumber))
      return "Phone Number must have at least 9 digits!";
    if (!formData.password) return "Password is required!";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters!";
    if (!/[A-Z]/.test(formData.password))
      return "Password must contain at least 1 uppercase letter!";
    if (!/[a-z]/.test(formData.password))
      return "Password must contain at least 1 lowercase letter!";
    if (!/[0-9]/.test(formData.password))
      return "Password must contain at least 1 number!";
    if (!/[!@#$%^&*]/.test(formData.password))
      return "Password must contain at least 1 special character (!@#$%^&*)!";
    if (!formData.confirmPassword) return "Please confirm your password!";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match!";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username: formData.username,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        residenceId: 1,
        isOwner: false,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    paddingLeft: "40px",
    paddingRight: "16px",
    paddingTop: "11px",
    paddingBottom: "11px",
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
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "rgba(34,197,94,0.5)";
    e.target.style.background = "rgba(34,197,94,0.05)";
    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.background = "rgba(255,255,255,0.06)";
    e.target.style.boxShadow = "none";
  };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.25)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
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
          <div className="mb-6">
            <h2 className="text-xl font-black text-white mb-1">
              Create account
            </h2>
            <p
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.4)", fontWeight: "500" }}
            >
              Fill in your details to get started
            </p>
          </div>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div className="relative">
                <MdPerson size={16} style={iconStyle} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Smith"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label style={labelStyle}>Username</label>
              <div className="relative">
                <MdPerson size={16} style={iconStyle} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. john_smith"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div className="relative">
                <MdEmail size={16} style={iconStyle} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@email.com"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <div className="relative">
                <MdPhone size={16} style={iconStyle} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. +38344123456"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div className="relative">
                <MdLock size={16} style={iconStyle} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars, uppercase, number, special"
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div className="relative">
                <MdLock size={16} style={iconStyle} />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? (
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Role</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  paddingLeft: "16px",
                  cursor: "pointer",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option
                  value={1}
                  style={{ background: "#0d1f0d", color: "white" }}
                >
                  Super Admin
                </option>
                <option
                  value={2}
                  style={{ background: "#0d1f0d", color: "white" }}
                >
                  Admin
                </option>
                <option
                  value={3}
                  style={{ background: "#0d1f0d", color: "white" }}
                >
                  Resident
                </option>
                <option
                  value={4}
                  style={{ background: "#0d1f0d", color: "white" }}
                >
                  Security
                </option>
                <option
                  value={5}
                  style={{ background: "#0d1f0d", color: "white" }}
                >
                  Maintenance
                </option>
              </select>
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
              {loading ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#4ade80",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
