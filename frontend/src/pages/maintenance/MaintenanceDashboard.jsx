import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdBuild,
  MdCheckCircle,
  MdPending,
  MdWarning,
  MdArrowForward,
  MdNotifications,
} from "react-icons/md";
import api from "../../services/api";

function MaintenanceDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, notificationsRes] = await Promise.all([
          api.get("/problemreports"),
          api.get("/notifications/my"),
        ]);
        setReports(reportsRes.data);
        setNotifications(notificationsRes.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pending = reports.filter((r) => r.status === "Pending");
  const inProgress = reports.filter((r) => r.status === "InProgress");
  const resolved = reports.filter((r) => r.status === "Resolved");

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
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #92400e, #d97706)",
          boxShadow: "0 4px 20px rgba(217,119,6,0.3)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <MdBuild size={28} className="text-white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "white",
                letterSpacing: "-0.5px",
              }}
            >
              Maintenance Dashboard
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                marginTop: "3px",
                fontWeight: "500",
              }}
            >
              Welcome back, {user?.username}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pending",
            value: pending.length,
            icon: MdWarning,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "In Progress",
            value: inProgress.length,
            icon: MdBuild,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Resolved",
            value: resolved.length,
            icon: MdCheckCircle,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
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
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
              >
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "26px",
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
                    marginTop: "3px",
                  }}
                >
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid #f1f5f9", background: "#fffbeb" }}
          >
            <div className="flex items-center gap-2">
              <MdWarning size={16} style={{ color: "#d97706" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#92400e",
                }}
              >
                Pending
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{ background: "#fde68a", color: "#92400e" }}
              >
                {pending.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/problem-reports")}
              className="flex items-center gap-1 text-xs font-bold"
              style={{
                color: "#d97706",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all <MdArrowForward size={14} />
            </button>
          </div>
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            {pending.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <MdCheckCircle size={28} style={{ color: "#22c55e" }} />
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    marginTop: "6px",
                  }}
                >
                  No pending issues
                </p>
              </div>
            ) : (
              pending.map((r, i) => (
                <div
                  key={r.problemReportId}
                  className="p-4 transition-all"
                  style={{
                    borderBottom:
                      i < pending.length - 1 ? "1px solid #f8fafc" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.description}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#d97706",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {r.residentName} ·{" "}
                    {r.reportedAt
                      ? new Date(r.reportedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* In progress */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid #f1f5f9", background: "#eff6ff" }}
          >
            <div className="flex items-center gap-2">
              <MdBuild size={16} style={{ color: "#2563eb" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#1e40af",
                }}
              >
                In Progress
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{ background: "#bfdbfe", color: "#1e40af" }}
              >
                {inProgress.length}
              </span>
            </div>
            <button
              onClick={() => navigate("/problem-reports")}
              className="flex items-center gap-1 text-xs font-bold"
              style={{
                color: "#2563eb",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all <MdArrowForward size={14} />
            </button>
          </div>
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            {inProgress.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <MdCheckCircle size={28} style={{ color: "#22c55e" }} />
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    marginTop: "6px",
                  }}
                >
                  No issues in progress
                </p>
              </div>
            ) : (
              inProgress.map((r, i) => (
                <div
                  key={r.problemReportId}
                  className="p-4 transition-all"
                  style={{
                    borderBottom:
                      i < inProgress.length - 1 ? "1px solid #f8fafc" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.description}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#2563eb",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {r.residentName} ·{" "}
                    {r.reportedAt
                      ? new Date(r.reportedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent nots */}
      {notifications.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MdNotifications size={18} style={{ color: "#7c3aed" }} />
            <p
              style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}
            >
              Recent Notifications
            </p>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n.notificationId}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
                >
                  <MdNotifications size={15} style={{ color: "#7c3aed" }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceDashboard;
