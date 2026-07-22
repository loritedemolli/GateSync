import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdHome,
  MdClose,
  MdCheck,
  MdFilterList,
  MdApartment,
  MdPeople,
} from "react-icons/md";
import api from "../../services/api";

function ResidencesPage() {
  const [residences, setResidences] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterNeighborhood, setFilterNeighborhood] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    type: 0,
    neighborhoodId: "",
    isOccupied: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [residencesRes, neighborhoodsRes] = await Promise.all([
        api.get("/residences"),
        api.get("/neighborhoods"),
      ]);
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

  const filtered = residences.filter((r) => {
    const matchSearch =
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.neighborhoodName?.toLowerCase().includes(search.toLowerCase());
    const matchNeighborhood =
      !filterNeighborhood || r.neighborhoodName === filterNeighborhood;
    const matchType = !filterType || r.type === filterType;
    const matchStatus =
      filterStatus === ""
        ? true
        : filterStatus === "occupied"
          ? r.isOccupied
          : !r.isOccupied;
    return matchSearch && matchNeighborhood && matchType && matchStatus;
  });

  const openAdd = () => {
    setSelected(null);
    setFormData({
      address: "",
      type: 0,
      neighborhoodId: neighborhoods[0]?.neighborhoodId || "",
      isOccupied: false,
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setSelected(item);
    setFormData({
      address: item.address,
      type: item.type === "Apartment" ? 0 : 1,
      neighborhoodId:
        neighborhoods.find((n) => n.name === item.neighborhoodName)
          ?.neighborhoodId || "",
      isOccupied: item.isOccupied,
    });
    setError("");
    setShowModal(true);
  };

  const openDelete = (item) => {
    setSelected(item);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (!formData.address || formData.address.length < 5)
      return setError("Address must be at least 5 characters!");
    if (!formData.neighborhoodId)
      return setError("Please select a neighborhood!");

    setSaving(true);
    try {
      if (selected) {
        await api.put(`/residences/${selected.residenceId}`, {
          address: formData.address,
          type: parseInt(formData.type),
          neighborhoodId: parseInt(formData.neighborhoodId),
          isOccupied: formData.isOccupied,
        });
      } else {
        await api.post("/residences", {
          address: formData.address,
          type: parseInt(formData.type),
          neighborhoodId: parseInt(formData.neighborhoodId),
        });
      }
      await fetchData();
      setShowModal(false);
    } catch {
      setError("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/residences/${selected.residenceId}`);
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
    ...new Set(residences.map((r) => r.neighborhoodName).filter(Boolean)),
  ];
  const uniqueTypes = [
    ...new Set(residences.map((r) => r.type).filter(Boolean)),
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
            Residences
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {residences.length} total ·{" "}
            {residences.filter((r) => r.isOccupied).length} occupied ·{" "}
            {residences.filter((r) => !r.isOccupied).length} available
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
          <MdAdd size={18} /> Add Residence
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: residences.length,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
            icon: MdHome,
          },
          {
            label: "Occupied",
            value: residences.filter((r) => r.isOccupied).length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            icon: MdPeople,
          },
          {
            label: "Available",
            value: residences.filter((r) => !r.isOccupied).length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
            icon: MdApartment,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "24px",
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
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-48"
          style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
        >
          <MdSearch size={17} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by address or neighborhood..."
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

        {/* Filter Neighborhood */}
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

        {/* Filter Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
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
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
          <option value="">All Status</option>
          <option value="occupied">Occupied</option>
          <option value="available">Available</option>
        </select>

        {/* Results */}
        <span
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
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
            gridTemplateColumns: "2fr 1fr 1fr 100px 100px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Address", "Neighborhood", "Type", "Status", "Actions"].map((h) => (
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
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <MdHome size={40} style={{ color: "#e2e8f0" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No residences found
            </p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.residenceId}
              className="grid px-5 py-4 transition-all"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 100px 100px",
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
              {/* Address */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.isOccupied ? "#f0fdf4" : "#fffbeb",
                    border: `1px solid ${item.isOccupied ? "#bbf7d0" : "#fde68a"}`,
                  }}
                >
                  <MdHome
                    size={18}
                    style={{ color: item.isOccupied ? "#16a34a" : "#d97706" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.address}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                    }}
                  >
                    {item.cityName}, {item.countryName}
                  </p>
                </div>
              </div>

              {/* Neighborhood */}
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                }}
              >
                {item.neighborhoodName}
              </span>

              {/* Type */}
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                }}
              >
                {item.type}
              </span>

              {/* Status */}
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                style={{
                  background: item.isOccupied ? "#f0fdf4" : "#fffbeb",
                  color: item.isOccupied ? "#16a34a" : "#d97706",
                  border: `1px solid ${item.isOccupied ? "#bbf7d0" : "#fde68a"}`,
                }}
              >
                {item.isOccupied ? "Occupied" : "Available"}
              </span>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#dbeafe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                >
                  <MdEdit size={14} style={{ color: "#2563eb" }} />
                </button>
                <button
                  onClick={() => openDelete(item)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fef2f2")
                  }
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
                {selected ? "Edit Residence" : "Add Residence"}
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
              {/* Address */}
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
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="e.g. Apt 1, Building A"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Type */}
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
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, type: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value={0}>Apartment</option>
                  <option value={1}>House</option>
                </select>
              </div>

              {/* Neighborhood */}
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
                  Neighborhood
                </label>
                <select
                  value={formData.neighborhoodId}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      neighborhoodId: e.target.value,
                    }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select neighborhood...</option>
                  {neighborhoods.map((n) => (
                    <option key={n.neighborhoodId} value={n.neighborhoodId}>
                      {n.name} — {n.cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* IsOccupied - vetem ne edit */}
              {selected && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isOccupied"
                    checked={formData.isOccupied}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        isOccupied: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                    style={{ accentColor: "#22c55e" }}
                  />
                  <label
                    htmlFor="isOccupied"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Occupied
                  </label>
                </div>
              )}
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
                    : "Add Residence"}
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
                Delete Residence
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
                  {selected?.address}
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

export default ResidencesPage;
