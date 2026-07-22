import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdPeople,
  MdHome,
  MdClose,
  MdCheck,
  MdPerson,
  MdEmail,
  MdPhone,
  MdVisibility,
} from "react-icons/md";
import api from "../../services/api";

function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [residences, setResidences] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterNeighborhood, setFilterNeighborhood] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterResidence, setFilterResidence] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    isOwner: false,
    residenceId: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [residentsRes, residencesRes, neighborhoodsRes] = await Promise.all(
        [
          api.get("/residents"),
          api.get("/residences"),
          api.get("/neighborhoods"),
        ],
      );
      setResidents(residentsRes.data);
      setResidences(residencesRes.data);
      setNeighborhoods(neighborhoodsRes.data);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phoneNumber?.includes(search);
    const matchNeighborhood =
      !filterNeighborhood || r.neighborhoodName === filterNeighborhood;
    const matchOwner =
      filterOwner === ""
        ? true
        : filterOwner === "owner"
          ? r.isOwner
          : !r.isOwner;
    const matchResidence =
      !filterResidence || r.residenceAddress === filterResidence;
    return matchSearch && matchNeighborhood && matchOwner && matchResidence;
  });

  const openAdd = () => {
    setSelected(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      isOwner: false,
      residenceId: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setSelected(item);
    setFormData({
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      isOwner: item.isOwner,
      residenceId:
        residences.find((r) => r.address === item.residenceAddress)
          ?.residenceId || "",
    });
    setError("");
    setShowModal(true);
  };

  const openView = (item) => {
    setSelected(item);
    setShowViewModal(true);
  };

  const openDelete = (item) => {
    setSelected(item);
    setShowDeleteModal(true);
  };

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
      if (selected) {
        await api.put(`/residents/${selected.residentId}`, {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          isOwner: formData.isOwner,
          residenceId: formData.residenceId
            ? parseInt(formData.residenceId)
            : null,
        });
      } else {
        await api.post("/residents", {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          isOwner: formData.isOwner,
          residenceId: formData.residenceId
            ? parseInt(formData.residenceId)
            : null,
        });
      }
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/residents/${selected.residentId}`);
      await fetchData();
      setShowDeleteModal(false);
    } catch {
      setShowDeleteModal(false);
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

  const uniqueNeighborhoods = [
    ...new Set(residents.map((r) => r.neighborhoodName).filter(Boolean)),
  ];

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
            Residents
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {residents.length} total ·{" "}
            {residents.filter((r) => r.isOwner).length} owners ·{" "}
            {residents.filter((r) => !r.isOwner).length} tenants
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #22c55e, #15803d)",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <MdAdd size={18} /> Add Resident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: residents.length,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Owners",
            value: residents.filter((r) => r.isOwner).length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Tenants",
            value: residents.filter((r) => !r.isOwner).length,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            label: "No Residence",
            value: residents.filter((r) => !r.residenceAddress).length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-4"
            style={{
              background: "#fff",
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: "1",
              }}
            >
              {card.value}
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: card.color,
                marginTop: "4px",
              }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
          style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
        >
          <MdSearch size={17} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "13px",
              fontWeight: "500",
              color: "#0f172a",
              width: "100%",
            }}
          />
        </div>

        <select
          value={filterNeighborhood}
          onChange={(e) => setFilterNeighborhood(e.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: "12px",
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Neighborhoods</option>
          {uniqueNeighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: "12px",
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="">All Types</option>
          <option value="owner">Owners</option>
          <option value="tenant">Tenants</option>
        </select>

        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 120px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Resident", "Email", "Phone", "Residence", "Type", "Actions"].map(
            (h) => (
              <span
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {h}
              </span>
            ),
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <MdPeople size={40} style={{ color: "#e2e8f0" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No residents found
            </p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.residentId}
              className="grid px-5 py-4 transition-all"
              style={{
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 120px",
                alignItems: "center",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #f8fafc" : "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #15803d)",
                  }}
                >
                  {item.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.fullName}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                    }}
                  >
                    {item.neighborhoodName || "No neighborhood"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <span
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                {item.email}
              </span>

              {/* Phone */}
              <span
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                {item.phoneNumber}
              </span>

              {/* Residence */}
              {item.residenceAddress ? (
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                  style={{
                    background: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  {item.residenceAddress}
                </span>
              ) : (
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                  }}
                >
                  Not assigned
                </span>
              )}

              {/* Type */}
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                style={{
                  background: item.isOwner ? "#eff6ff" : "#f5f3ff",
                  color: item.isOwner ? "#2563eb" : "#7c3aed",
                  border: `1px solid ${item.isOwner ? "#bfdbfe" : "#ddd6fe"}`,
                }}
              >
                {item.isOwner ? "Owner" : "Tenant"}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openView(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <MdVisibility size={14} style={{ color: "#16a34a" }} />
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                >
                  <MdEdit size={14} style={{ color: "#2563eb" }} />
                </button>
                <button
                  onClick={() => openDelete(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <MdDelete size={14} style={{ color: "#dc2626" }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
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
                {selected ? "Edit Resident" : "Add Resident"}
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
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, fullName: e.target.value }))
                    }
                    placeholder="e.g. John Smith"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
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
                  Email
                </label>
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="e.g. john@email.com"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
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
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="e.g. +38344123456"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
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
                  Residence (optional)
                </label>
                <select
                  value={formData.residenceId}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, residenceId: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Not assigned yet</option>
                  {residences
                    .filter(
                      (r) =>
                        !r.isOccupied ||
                        r.residenceId === selected?.residenceId,
                    )
                    .map((r) => (
                      <option key={r.residenceId} value={r.residenceId}>
                        {r.address} — {r.neighborhoodName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isOwner"
                  checked={formData.isOwner}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isOwner: e.target.checked }))
                  }
                  className="w-4 h-4"
                  style={{ accentColor: "#22c55e" }}
                />
                <label
                  htmlFor="isOwner"
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Is Owner
                </label>
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
                  boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                }}
              >
                <MdCheck size={16} />
                {saving
                  ? "Saving..."
                  : selected
                    ? "Save Changes"
                    : "Add Resident"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selected && (
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
                Resident Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            {/* Avatar */}
            <div
              className="flex items-center gap-4 mb-6 p-4 rounded-2xl"
              style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                }}
              >
                {selected.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  {selected.fullName}
                </p>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{
                    background: selected.isOwner ? "#eff6ff" : "#f5f3ff",
                    color: selected.isOwner ? "#2563eb" : "#7c3aed",
                    border: `1px solid ${selected.isOwner ? "#bfdbfe" : "#ddd6fe"}`,
                  }}
                >
                  {selected.isOwner ? "Owner" : "Tenant"}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {[
                { icon: MdEmail, label: "Email", value: selected.email },
                { icon: MdPhone, label: "Phone", value: selected.phoneNumber },
                {
                  icon: MdHome,
                  label: "Residence",
                  value: selected.residenceAddress || "Not assigned",
                },
                {
                  icon: MdPeople,
                  label: "Neighborhood",
                  value: selected.neighborhoodName || "N/A",
                },
              ].map((detail) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={detail.label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <Icon size={15} style={{ color: "#16a34a" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {detail.label}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {detail.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEdit(selected);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                }}
              >
                Edit Resident
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "#fff",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <MdDelete size={24} style={{ color: "#dc2626" }} />
              </div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Delete Resident
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to delete{" "}
                <strong style={{ color: "#0f172a" }}>
                  {selected?.fullName}
                </strong>
                ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentsPage;
