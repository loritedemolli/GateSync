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
  MdPersonAdd,
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

  const inputStyle = {
    width: "100%",
    paddingLeft: "40px",
    paddingRight: "16px",
    paddingTop: "11px",
    paddingBottom: "11px",
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
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#22c55e";
    e.target.style.background = "#f0fdf4";
    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
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
          Join your
          <br />
          <span style={{ color: "#4ade80" }}>community</span>
          <br />
          today.
        </h2>
        <p className="text-green-300 text-lg leading-relaxed max-w-md">
          Create your account and start managing your neighborhood experience
          seamlessly.
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

      {/* Right Side */}
      <div
        className="flex items-center justify-center w-full lg:flex-1 p-6"
        style={{ background: "rgba(0,0,0,0.15)" }}
      >
        <div className="w-full max-w-sm">
          {/* Card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "#ffffff",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
                }}
              >
                <MdPersonAdd size={22} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Create account
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "4px",
                  fontWeight: "500",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Fill in your details to get started
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
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

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
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
                  <MdEmail
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
                  <MdPhone
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
                      color: "#94a3b8",
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
                      color: "#94a3b8",
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
                  <option value={1}>Super Admin</option>
                  <option value={2}>Admin</option>
                  <option value={3}>Resident</option>
                  <option value={4}>Security</option>
                  <option value={5}>Maintenance</option>
                </select>
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
                  marginTop: "4px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "16px 0",
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
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#16a34a",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Sign in
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
          >
            © 2026 GateSync. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
