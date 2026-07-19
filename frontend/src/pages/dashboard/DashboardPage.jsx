import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdPeople,
  MdHome,
  MdReceipt,
  MdBuild,
  MdWarning,
  MdCheckCircle,
  MdEventAvailable,
  MdPayment,
  MdArrowForward,
  MdTrendingUp,
  MdPersonAdd,
  MdAdd,
  MdNotifications,
} from "react-icons/md";
import api from "../../services/api";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    residents: 0,
    residences: 0,
    occupiedResidences: 0,
    totalInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    openProblems: 0,
    resolvedProblems: 0,
    todayReservations: 0,
    recentPayments: [],
    recentProblems: [],
    recentReservations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          residents,
          residences,
          invoices,
          problems,
          reservations,
          payments,
        ] = await Promise.all([
          api.get("/residents"),
          api.get("/residences"),
          api.get("/invoices"),
          api.get("/problem-reports"),
          api.get("/reservations"),
          api.get("/payments"),
        ]);

        const today = new Date().toDateString();

        setStats({
          residents: residents.data.length,
          residences: residences.data.length,
          occupiedResidences: residences.data.filter((r) => r.isOccupied)
            .length,
          totalInvoices: invoices.data.length,
          unpaidInvoices: invoices.data.filter((i) => i.status === "Pending")
            .length,
          overdueInvoices: invoices.data.filter((i) => i.status === "Overdue")
            .length,
          openProblems: problems.data.filter(
            (p) => p.status === "Pending" || p.status === "InProgress",
          ).length,
          resolvedProblems: problems.data.filter((p) => p.status === "Resolved")
            .length,
          todayReservations: reservations.data.filter(
            (r) => new Date(r.time).toDateString() === today,
          ).length,
          recentPayments: payments.data.slice(0, 4),
          recentProblems: problems.data
            .filter((p) => p.status === "Pending")
            .slice(0, 4),
          recentReservations: reservations.data
            .filter((r) => r.status === "Pending")
            .slice(0, 4),
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Residents",
      value: stats.residents,
      icon: MdPeople,
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      sub: "Active residents",
      action: () => navigate("/residents"),
    },
    {
      label: "Residences",
      value: `${stats.occupiedResidences}/${stats.residences}`,
      icon: MdHome,
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
      sub: "Occupied / Total",
      action: () => navigate("/residences"),
    },
    {
      label: "Unpaid Invoices",
      value: stats.unpaidInvoices,
      icon: MdReceipt,
      color: stats.unpaidInvoices > 0 ? "#d97706" : "#16a34a",
      bg: stats.unpaidInvoices > 0 ? "#fffbeb" : "#f0fdf4",
      border: stats.unpaidInvoices > 0 ? "#fde68a" : "#bbf7d0",
      sub: `${stats.overdueInvoices} overdue`,
      action: () => navigate("/invoices"),
    },
    {
      label: "Open Issues",
      value: stats.openProblems,
      icon: MdBuild,
      color: stats.openProblems > 0 ? "#dc2626" : "#16a34a",
      bg: stats.openProblems > 0 ? "#fef2f2" : "#f0fdf4",
      border: stats.openProblems > 0 ? "#fecaca" : "#bbf7d0",
      sub: `${stats.resolvedProblems} resolved`,
      action: () => navigate("/problem-reports"),
    },
  ];

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Alerts */}
        {(stats.overdueInvoices > 0 || stats.openProblems > 0) && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <MdWarning size={16} style={{ color: "#dc2626" }} />
            <span
              style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626" }}
            >
              {stats.overdueInvoices > 0 &&
                `${stats.overdueInvoices} overdue invoices`}
              {stats.overdueInvoices > 0 && stats.openProblems > 0 && " · "}
              {stats.openProblems > 0 && `${stats.openProblems} open issues`}
            </span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={card.action}
              className="rounded-2xl p-5 cursor-pointer transition-all"
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                  }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <MdArrowForward size={16} style={{ color: "#cbd5e1" }} />
              </div>
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
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: card.color,
                  marginTop: "2px",
                }}
              >
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Today's Summary */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MdTrendingUp size={18} color="white" />
            <span
              style={{ fontSize: "13px", fontWeight: "700", color: "white" }}
            >
              Today's Summary
            </span>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Reservations Today",
                value: stats.todayReservations,
                icon: MdEventAvailable,
              },
              {
                label: "Pending Payments",
                value: stats.unpaidInvoices,
                icon: MdPayment,
              },
              {
                label: "Unread Notifications",
                value: 0,
                icon: MdNotifications,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={15}
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "800",
                      color: "white",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "12px",
            }}
          >
            Quick Actions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Add Resident",
                icon: MdPersonAdd,
                color: "#16a34a",
                bg: "#f0fdf4",
                path: "/residents",
              },
              {
                label: "New Invoice",
                icon: MdAdd,
                color: "#2563eb",
                bg: "#eff6ff",
                path: "/invoices",
              },
              {
                label: "Reservation",
                icon: MdEventAvailable,
                color: "#7c3aed",
                bg: "#f5f3ff",
                path: "/reservations",
              },
              {
                label: "View Reports",
                icon: MdTrendingUp,
                color: "#0891b2",
                bg: "#ecfeff",
                path: "/reports",
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                  style={{ background: action.bg }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white">
                    <Icon size={18} style={{ color: action.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#374151",
                      textAlign: "center",
                    }}
                  >
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Problem Reports */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}
            >
              Pending Issues
            </p>
            <button
              onClick={() => navigate("/problem-reports")}
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#16a34a",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all
            </button>
          </div>
          {stats.recentProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <MdCheckCircle size={32} style={{ color: "#22c55e" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginTop: "8px",
                }}
              >
                No pending issues
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentProblems.map((problem, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <MdBuild
                    size={16}
                    style={{ color: "#dc2626", flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#0f172a",
                        truncate: true,
                      }}
                    >
                      {problem.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                      }}
                    >
                      {problem.residentName}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#dc2626",
                      background: "#fff",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      border: "1px solid #fecaca",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}
            >
              Pending Reservations
            </p>
            <button
              onClick={() => navigate("/reservations")}
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#16a34a",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all
            </button>
          </div>
          {stats.recentReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <MdCheckCircle size={32} style={{ color: "#22c55e" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginTop: "8px",
                }}
              >
                No pending reservations
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentReservations.map((res, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
                >
                  <MdEventAvailable
                    size={16}
                    style={{ color: "#7c3aed", flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {res.facilityName}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                      }}
                    >
                      {res.residentName} ·{" "}
                      {new Date(res.time).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#7c3aed",
                      background: "#fff",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      border: "1px solid #ddd6fe",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
