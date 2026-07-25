import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdReceipt,
  MdEventAvailable,
  MdBuild,
  MdNotifications,
  MdHome,
  MdPerson,
  MdWarning,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import api from "../../services/api";

function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    profile: null,
    invoices: [],
    reservations: [],
    problems: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          profileRes,
          invoicesRes,
          reservationsRes,
          problemsRes,
          notificationsRes,
        ] = await Promise.all([
          api.get("/residents/my-profile"),
          api.get("/invoices/my"),
          api.get("/reservations/my"),
          api.get("/problemreports/my"),
          api.get("/notifications/my"),
        ]);
        setData({
          profile: profileRes.data,
          invoices: invoicesRes.data,
          reservations: reservationsRes.data,
          problems: problemsRes.data,
          notifications: notificationsRes.data,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const unpaidInvoices = data.invoices.filter(
    (i) => i.status === "Pending" || i.status === "Overdue",
  );
  const totalOwed = unpaidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
  const pendingReservations = data.reservations.filter(
    (r) => r.status === "Pending",
  );
  const openProblems = data.problems.filter(
    (p) => p.status === "Pending" || p.status === "InProgress",
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Welcome Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {data.profile?.fullName?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase()}
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
              Welcome back, {data.profile?.fullName || user?.username}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <MdHome size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "500",
                }}
              >
                {data.profile?.residenceAddress || "No residence assigned"}
                {data.profile?.neighborhoodName &&
                  ` · ${data.profile.neighborhoodName}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert nese ka fatura te papaguara */}
      {unpaidInvoices.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between"
          style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
        >
          <div className="flex items-center gap-3">
            <MdWarning size={20} style={{ color: "#dc2626" }} />
            <div>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#dc2626",
                }}
              >
                You have {unpaidInvoices.length} unpaid invoice
                {unpaidInvoices.length > 1 ? "s" : ""}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#ef4444",
                  fontWeight: "500",
                }}
              >
                Total owed: ${totalOwed.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/my-invoices")}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold"
            style={{ background: "#dc2626", color: "white" }}
          >
            Pay Now <MdArrowForward size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Unpaid Invoices",
            value: unpaidInvoices.length,
            icon: MdReceipt,
            color: unpaidInvoices.length > 0 ? "#dc2626" : "#16a34a",
            bg: unpaidInvoices.length > 0 ? "#fef2f2" : "#f0fdf4",
            border: unpaidInvoices.length > 0 ? "#fecaca" : "#bbf7d0",
            path: "/my-invoices",
          },
          {
            label: "Reservations",
            value: data.reservations.length,
            icon: MdEventAvailable,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
            path: "/my-reservations",
          },
          {
            label: "Open Issues",
            value: openProblems.length,
            icon: MdBuild,
            color: openProblems.length > 0 ? "#d97706" : "#16a34a",
            bg: openProblems.length > 0 ? "#fffbeb" : "#f0fdf4",
            border: openProblems.length > 0 ? "#fde68a" : "#bbf7d0",
            path: "/my-problems",
          },
          {
            label: "Notifications",
            value: data.notifications.length,
            icon: MdNotifications,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
            path: "/my-notifications",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => navigate(card.path)}
              className="rounded-2xl p-4 cursor-pointer transition-all"
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
              <div className="flex items-center justify-between mb-3">
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
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Invoices */}
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
              style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}
            >
              Recent Invoices
            </p>
            <button
              onClick={() => navigate("/my-invoices")}
              style={{
                fontSize: "12px",
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
          {data.invoices.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <MdCheckCircle size={32} style={{ color: "#22c55e" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginTop: "8px",
                }}
              >
                No invoices
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.invoices.slice(0, 4).map((inv, i) => {
                const isPending = inv.status === "Pending";
                const isOverdue = inv.status === "Overdue";
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: isOverdue
                        ? "#fef2f2"
                        : isPending
                          ? "#fffbeb"
                          : "#f0fdf4",
                      border: `1px solid ${isOverdue ? "#fecaca" : isPending ? "#fde68a" : "#bbf7d0"}`,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        ${inv.amount?.toFixed(2)}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          fontWeight: "500",
                        }}
                      >
                        Due:{" "}
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        background: "white",
                        color: isOverdue
                          ? "#dc2626"
                          : isPending
                            ? "#d97706"
                            : "#16a34a",
                        border: `1px solid ${isOverdue ? "#fecaca" : isPending ? "#fde68a" : "#bbf7d0"}`,
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
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
              style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}
            >
              Notifications
            </p>
            <button
              onClick={() => navigate("/my-notifications")}
              style={{
                fontSize: "12px",
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
          {data.notifications.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <MdCheckCircle size={32} style={{ color: "#22c55e" }} />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginTop: "8px",
                }}
              >
                No notifications
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.notifications.slice(0, 4).map((notif, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <MdNotifications size={15} style={{ color: "#16a34a" }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {notif.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        marginTop: "2px",
                      }}
                    >
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;
