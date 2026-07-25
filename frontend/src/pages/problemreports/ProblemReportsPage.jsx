import { useState, useEffect } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdBuild,
  MdClose,
  MdCheck,
  MdVisibility,
  MdWarning,
  MdCheckCircle,
  MdPending,
  MdPerson,
} from "react-icons/md";
import api from "../../services/api";

function ProblemReportsPage() {
  const [reports, setReports] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    residentId: "",
    status: 0,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [reportsRes, residentsRes] = await Promise.all([
        api.get("/problemreports"),
        api.get("/residents"),
      ]);
      setReports(reportsRes.data);
      setResidents(residentsRes.data);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
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
      case "InProgress":
        return {
          bg: "#eff6ff",
          color: "#2563eb",
          border: "#bfdbfe",
          icon: MdBuild,
        };
      case "Resolved":
        return {
          bg: "#f0fdf4",
          color: "#16a34a",
          border: "#bbf7d0",
          icon: MdCheckCircle,
        };
      default:
        return {
          bg: "#f8fafc",
          color: "#64748b",
          border: "#e2e8f0",
          icon: MdWarning,
        };
    }
  };

  const openAdd = () => {
    setSelected(null);
    setFormData({
      title: "",
      description: "",
      residentId: residents[0]?.residentId || "",
      status: 0,
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setSelected(item);
    setFormData({
      title: item.title,
      description: item.description,
      residentId:
        residents.find((r) => r.fullName === item.residentName)?.residentId ||
        "",
      status:
        item.status === "Pending" ? 0 : item.status === "InProgress" ? 1 : 2,
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

  const handleSave = async () => {
    if (!formData.title || formData.title.length < 3)
      return setError("Title must be at least 3 characters!");
    if (!formData.description || formData.description.length < 10)
      return setError("Description must be at least 10 characters!");
    if (!formData.residentId) return setError("Please select a resident!");

    setSaving(true);
    try {
      if (selected) {
        await api.put(`/problemreports/${selected.problemReportId}`, {
          title: formData.title,
          description: formData.description,
          residentId: parseInt(formData.residentId),
          status: parseInt(formData.status),
        });
      } else {
        await api.post("/problemreports", {
          title: formData.title,
          description: formData.description,
          residentId: parseInt(formData.residentId),
          status: 0,
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
      await api.delete(`/problemreports/${selected.problemReportId}`);
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
            Problem Reports
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {reports.length} total ·{" "}
            {reports.filter((r) => r.status === "Pending").length} pending ·{" "}
            {reports.filter((r) => r.status === "Resolved").length} resolved
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
          <MdAdd size={18} /> Add Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pending",
            value: reports.filter((r) => r.status === "Pending").length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
            icon: MdWarning,
          },
          {
            label: "In Progress",
            value: reports.filter((r) => r.status === "InProgress").length,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
            icon: MdBuild,
          },
          {
            label: "Resolved",
            value: reports.filter((r) => r.status === "Resolved").length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            icon: MdCheckCircle,
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
            placeholder="Search by title or resident..."
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
          <option value="InProgress">In Progress</option>
          <option value="Resolved">Resolved</option>
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
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Title", "Resident", "Reported At", "Status", "Actions"].map(
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
            <MdBuild size={40} style={{ color: "#e2e8f0" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No problem reports found
            </p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const statusStyle = getStatusStyle(item.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div
                key={item.problemReportId}
                className="grid px-5 py-4 transition-all"
                style={{
                  gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px",
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
                {/* Title */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                    }}
                  >
                    <MdBuild size={17} style={{ color: statusStyle.color }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "200px",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Resident */}
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

                {/* Date */}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {item.reportedAt
                    ? new Date(item.reportedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>

                {/* Status */}
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

                {/* Actions */}
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
                    <MdEdit size={14} style={{ color: "#2563eb" }} />
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
                {selected ? "Edit Report" : "Add Report"}
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
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Broken elevator"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe the problem in detail..."
                  rows={4}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  Resident
                </label>
                <select
                  value={formData.residentId}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, residentId: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select resident...</option>
                  {residents.map((r) => (
                    <option key={r.residentId} value={r.residentId}>
                      {r.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, status: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option value={0}>Pending</option>
                    <option value={1}>In Progress</option>
                    <option value={2}>Resolved</option>
                  </select>
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
                }}
              >
                <MdCheck size={16} />
                {saving
                  ? "Saving..."
                  : selected
                    ? "Save Changes"
                    : "Add Report"}
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
                Report Details
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            {/* Status Banner */}
            {(() => {
              const style = getStatusStyle(selected.status);
              return (
                <div
                  className="rounded-2xl p-4 mb-5 flex items-center gap-3"
                  style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  <MdBuild size={20} style={{ color: style.color }} />
                  <div>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "#0f172a",
                      }}
                    >
                      {selected.title}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-lg text-xs font-bold"
                      style={{ background: "white", color: style.color }}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Description */}
            <div
              className="p-4 rounded-xl mb-4"
              style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                Description
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#374151",
                  lineHeight: "1.6",
                }}
              >
                {selected.description}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Reported By", value: selected.residentName },
                {
                  label: "Reported At",
                  value: selected.reportedAt
                    ? new Date(selected.reportedAt).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )
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
                Edit Report
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
                Delete Report
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
                <strong style={{ color: "#0f172a" }}>{selected?.title}</strong>?
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

export default ProblemReportsPage;
