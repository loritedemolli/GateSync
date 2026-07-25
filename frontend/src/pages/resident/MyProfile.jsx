import { useState, useEffect } from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdHome,
  MdEdit,
  MdCheck,
  MdClose,
} from "react-icons/md";
import api from "../../services/api";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/residents/my-profile");
      setProfile(res.data);
      setFormData({
        fullName: res.data.fullName,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
      });
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    if (!formData.fullName || formData.fullName.length < 5)
      return "Full Name must be at least 5 characters!";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Email is not valid!";
    if (
      !formData.phoneNumber ||
      !/^[+]?[0-9]{9,15}$/.test(formData.phoneNumber)
    )
      return "Phone Number must have at least 9 digits!";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) return setError(validationError);

    setSaving(true);
    try {
      await api.put(`/residents/${profile.residentId}`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        isOwner: profile.isOwner,
        residenceId: null,
      });
      await fetchProfile();
      setShowModal(false);
    } catch {
      setError("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
    transition: "all 0.15s",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            My Profile
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            Manage your personal information
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #22c55e, #15803d)",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          }}
        >
          <MdEdit size={18} /> Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
        }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl text-white flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {profile?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "white" }}>
              {profile?.fullName}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                marginTop: "4px",
              }}
            >
              {profile?.isOwner ? "Owner" : "Tenant"}
            </p>
            {profile?.residenceAddress && (
              <div className="flex items-center gap-2 mt-2">
                <MdHome size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                  {profile.residenceAddress}
                  {profile.neighborhoodName && ` · ${profile.neighborhoodName}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4">
        {[
          {
            icon: MdPerson,
            label: "Full Name",
            value: profile?.fullName,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            icon: MdEmail,
            label: "Email Address",
            value: profile?.email,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            icon: MdPhone,
            label: "Phone Number",
            value: profile?.phoneNumber,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            icon: MdHome,
            label: "Residence",
            value: profile?.residenceAddress || "Not assigned yet",
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <Icon size={20} style={{ color: item.color }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#0f172a",
                    marginTop: "2px",
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "#fff",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Edit Profile
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-4 mb-5">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="e.g. John Smith"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="e.g. john@email.com"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "8px",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                  placeholder="e.g. +38344123456"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: saving
                    ? "#86efac"
                    : "linear-gradient(135deg, #22c55e, #15803d)",
                }}
              >
                <MdCheck size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
