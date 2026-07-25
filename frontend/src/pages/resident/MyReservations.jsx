import { useState, useEffect } from "react";
import {
  MdEventAvailable,
  MdSearch,
  MdAdd,
  MdClose,
  MdCheck,
  MdCheckCircle,
  MdCancel,
  MdPending,
} from "react-icons/md";
import api from "../../services/api";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ facilityName: "", time: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/reservations/my");
      setReservations(res.data);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = reservations.filter((r) => {
    const matchSearch = r.facilityName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "#fffbeb",
          color: "#d97706",
          border: "#fde68a",
          icon: MdPending,
        };
      case "Approved":
        return {
          bg: "#f0fdf4",
          color: "#16a34a",
          border: "#bbf7d0",
          icon: MdCheckCircle,
        };
      case "Rejected":
        return {
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
          icon: MdCancel,
        };
      default:
        return {
          bg: "#f8fafc",
          color: "#64748b",
          border: "#e2e8f0",
          icon: MdPending,
        };
    }
  };

  const handleSave = async () => {
    if (!formData.facilityName || formData.facilityName.length < 2)
      return setError("Facility name must be at least 2 characters!");
    if (!formData.time) return setError("Please select a date and time!");

    setSaving(true);
    try {
      await api.post("/reservations", {
        facilityName: formData.facilityName,
        time: formData.time,
        status: 0,
      });
      await fetchData();
      setShowModal(false);
      setFormData({ facilityName: "", time: "" });
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
            My Reservations
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {reservations.length} total ·{" "}
            {reservations.filter((r) => r.status === "Pending").length} pending
            approval
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError("");
            setFormData({ facilityName: "", time: "" });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #22c55e, #15803d)",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          }}
        >
          <MdAdd size={18} /> New Reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pending",
            value: reservations.filter((r) => r.status === "Pending").length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Approved",
            value: reservations.filter((r) => r.status === "Approved").length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Rejected",
            value: reservations.filter((r) => r.status === "Rejected").length,
            color: "#dc2626",
            bg: "#fef2f2",
            border: "#fecaca",
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
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
          style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
        >
          <MdSearch size={17} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search reservations..."
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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16 rounded-2xl"
            style={{ background: "#fff", border: "1px solid #f1f5f9" }}
          >
            <MdCheckCircle size={40} style={{ color: "#22c55e" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No reservations found
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div
                key={item.reservationId}
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{
                  background: "#fff",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#f5f3ff",
                      border: "1px solid #ddd6fe",
                    }}
                  >
                    <MdEventAvailable size={20} style={{ color: "#7c3aed" }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {item.facilityName}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        marginTop: "2px",
                      }}
                    >
                      {item.time
                        ? new Date(item.time).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  <StatusIcon size={11} />
                  {item.status}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
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
                New Reservation
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
                  Facility Name
                </label>
                <input
                  type="text"
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, facilityName: e.target.value }))
                  }
                  placeholder="e.g. Gym, Pool, Hall..."
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
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
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, time: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
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
                {saving ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReservations;
