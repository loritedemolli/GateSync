import { useState, useEffect } from "react";
import {
  MdDelete,
  MdSearch,
  MdEventAvailable,
  MdClose,
  MdCheck,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdPending,
} from "react-icons/md";
import api from "../../services/api";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ status: 0 });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const reservationsRes = await api.get("/reservations");
      setReservations(reservationsRes.data);
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
    const matchSearch =
      r.facilityName?.toLowerCase().includes(search.toLowerCase()) ||
      r.residentName?.toLowerCase().includes(search.toLowerCase());
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

  const openEdit = (item) => {
    setSelected(item);
    setFormData({
      status:
        item.status === "Pending" ? 0 : item.status === "Approved" ? 1 : 2,
    });
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/reservations/${selected.reservationId}`, {
        facilityName: selected.facilityName,
        time: selected.time,
        residentId: selected.residentId,
        status: parseInt(formData.status),
      });
      await fetchData();
      setShowModal(false);
    } catch {
      console.log("Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/reservations/${selected.reservationId}`);
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

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Reservations
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pending",
            value: reservations.filter((r) => r.status === "Pending").length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
            icon: MdPending,
          },
          {
            label: "Approved",
            value: reservations.filter((r) => r.status === "Approved").length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            icon: MdCheckCircle,
          },
          {
            label: "Rejected",
            value: reservations.filter((r) => r.status === "Rejected").length,
            color: "#dc2626",
            bg: "#fef2f2",
            border: "#fecaca",
            icon: MdCancel,
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
                    color: card.color,
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
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
          style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
        >
          <MdSearch size={17} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search by facility or resident..."
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
            gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 120px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Facility", "Resident", "Date & Time", "Status", "Actions"].map(
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
            <MdEventAvailable size={40} style={{ color: "#e2e8f0" }} />
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
          filtered.map((item, i) => {
            const statusStyle = getStatusStyle(item.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div
                key={item.reservationId}
                className="grid px-5 py-4 transition-all"
                style={{
                  gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 120px",
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
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#f5f3ff",
                      border: "1px solid #ddd6fe",
                    }}
                  >
                    <MdEventAvailable size={17} style={{ color: "#7c3aed" }} />
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.facilityName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                    }}
                  >
                    {item.residentName?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {item.residentName}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {item.time
                    ? new Date(item.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>

                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  <StatusIcon size={11} />
                  {item.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openView(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <MdVisibility size={14} style={{ color: "#16a34a" }} />
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <MdCheck size={14} style={{ color: "#2563eb" }} />
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <MdDelete size={14} style={{ color: "#dc2626" }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Approve/Reject Modal */}
      {showModal && selected && (
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
            <div className="flex items-center justify-between mb-5">
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Update Status
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              {selected.facilityName} · {selected.residentName}
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  value: 0,
                  label: "Pending",
                  color: "#d97706",
                  bg: "#fffbeb",
                  border: "#fde68a",
                },
                {
                  value: 1,
                  label: "Approved",
                  color: "#16a34a",
                  bg: "#f0fdf4",
                  border: "#bbf7d0",
                },
                {
                  value: 2,
                  label: "Rejected",
                  color: "#dc2626",
                  bg: "#fef2f2",
                  border: "#fecaca",
                },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    setFormData((p) => ({ ...p, status: status.value }))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                  style={{
                    background:
                      formData.status === status.value ? status.bg : "#f8fafc",
                    border: `1.5px solid ${formData.status === status.value ? status.border : "#e2e8f0"}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color:
                        formData.status === status.value
                          ? status.color
                          : "#374151",
                    }}
                  >
                    {status.label}
                  </span>
                  {formData.status === status.value && (
                    <MdCheck size={16} style={{ color: status.color }} />
                  )}
                </button>
              ))}
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
                {saving ? "Saving..." : "Save"}
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
                Reservation Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            <div
              className="rounded-2xl p-4 mb-5"
              style={{
                background: "linear-gradient(135deg, #14532d, #16a34a)",
              }}
            >
              <p
                style={{ fontSize: "18px", fontWeight: "800", color: "white" }}
              >
                {selected.facilityName}
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold mt-1 inline-block"
                style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
              >
                {selected.status}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Resident", value: selected.residentName },
                {
                  label: "Date & Time",
                  value: selected.time
                    ? new Date(selected.time).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A",
                },
              ].map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    {detail.label}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
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
                Update Status
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
                Delete Reservation
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to delete reservation for{" "}
                <strong style={{ color: "#0f172a" }}>
                  {selected?.facilityName}
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

export default ReservationsPage;
