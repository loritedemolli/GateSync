import { useState, useEffect } from "react";
import {
  MdBuild,
  MdSearch,
  MdVisibility,
  MdWarning,
  MdCheckCircle,
  MdPending,
  MdClose,
  MdCheck,
} from "react-icons/md";
import api from "../../services/api";

function MaintenanceProblemsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/problemreports");
      setReports(res.data);
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

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setSaving(true);
    try {
      await api.put(`/problemreports/${selected.problemReportId}`, {
        title: selected.title,
        description: selected.description,
        residentId: selected.residentId,
        status:
          newStatus === "Pending" ? 0 : newStatus === "InProgress" ? 1 : 2,
      });
      await fetchData();
      setShowStatusModal(false);
    } catch {
      console.log("Error");
    } finally {
      setSaving(false);
    }
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
                    <MdBuild size={16} style={{ color: statusStyle.color }} />
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
                    onClick={() => {
                      setSelected(item);
                      setShowViewModal(true);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <MdVisibility size={14} style={{ color: "#16a34a" }} />
                  </button>
                  <button
                    onClick={() => {
                      setSelected(item);
                      setNewStatus(item.status);
                      setShowStatusModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#2563eb",
                    }}
                  >
                    <MdBuild size={12} /> Update
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                  setNewStatus(selected.status);
                  setShowStatusModal(true);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update status  */}
      {showStatusModal && selected && (
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
                onClick={() => setShowStatusModal(false)}
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
              {selected.title}
            </p>

            <div className="space-y-2 mb-6">
              {[
                {
                  value: "Pending",
                  label: "Pending",
                  color: "#d97706",
                  bg: "#fffbeb",
                  border: "#fde68a",
                },
                {
                  value: "InProgress",
                  label: "In Progress",
                  color: "#2563eb",
                  bg: "#eff6ff",
                  border: "#bfdbfe",
                },
                {
                  value: "Resolved",
                  label: "Resolved",
                  color: "#16a34a",
                  bg: "#f0fdf4",
                  border: "#bbf7d0",
                },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setNewStatus(status.value)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                  style={{
                    background:
                      newStatus === status.value ? status.bg : "#f8fafc",
                    border: `1.5px solid ${newStatus === status.value ? status.border : "#e2e8f0"}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color:
                        newStatus === status.value ? status.color : "#374151",
                    }}
                  >
                    {status.label}
                  </span>
                  {newStatus === status.value && (
                    <MdCheck size={18} style={{ color: status.color }} />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
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
                onClick={handleUpdateStatus}
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
    </div>
  );
}

export default MaintenanceProblemsPage;
