import { useState, useEffect } from "react";
import {
  MdAssessment,
  MdTrendingUp,
  MdPeople,
  MdHome,
  MdReceipt,
  MdBuild,
  MdEventAvailable,
  MdDirectionsCar,
  MdAttachMoney,
} from "react-icons/md";
import api from "../../services/api";

function ReportsPage() {
  const [data, setData] = useState({
    residents: [],
    residences: [],
    invoices: [],
    payments: [],
    problemReports: [],
    reservations: [],
    vehicles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          residents,
          residences,
          invoices,
          payments,
          problems,
          reservations,
          vehicles,
        ] = await Promise.all([
          api.get("/residents"),
          api.get("/residences"),
          api.get("/invoices"),
          api.get("/payments"),
          api.get("/problemreports"),
          api.get("/reservations"),
          api.get("/vehicles"),
        ]);
        setData({
          residents: residents.data,
          residences: residences.data,
          invoices: invoices.data,
          payments: payments.data,
          problemReports: problems.data,
          reservations: reservations.data,
          vehicles: vehicles.data,
        });
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRevenue = data.payments.reduce(
    (sum, p) => sum + (p.paidAmount || 0),
    0,
  );
  const pendingRevenue = data.invoices
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const overdueRevenue = data.invoices
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const occupancyRate =
    data.residences.length > 0
      ? Math.round(
          (data.residences.filter((r) => r.isOccupied).length /
            data.residences.length) *
            100,
        )
      : 0;
  const resolvedRate =
    data.problemReports.length > 0
      ? Math.round(
          (data.problemReports.filter((p) => p.status === "Resolved").length /
            data.problemReports.length) *
            100,
        )
      : 0;
  const approvalRate =
    data.reservations.length > 0
      ? Math.round(
          (data.reservations.filter((r) => r.status === "Approved").length /
            data.reservations.length) *
            100,
        )
      : 0;

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
      <div className="mb-6">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Reports & Analytics
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          System overview and performance metrics
        </p>
      </div>

      {/* Financial summary */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Financial Overview
        </p>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              label: "Total Collected",
              value: `$${totalRevenue.toFixed(2)}`,
              sub: "All time payments",
            },
            {
              label: "Pending",
              value: `$${pendingRevenue.toFixed(2)}`,
              sub: "Awaiting payment",
            },
            {
              label: "Overdue",
              value: `$${overdueRevenue.toFixed(2)}`,
              sub: "Past due date",
            },
          ].map((item) => (
            <div key={item.label}>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: "white",
                  lineHeight: "1",
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.9)",
                  marginTop: "4px",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.6)",
                  marginTop: "2px",
                }}
              >
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Residents",
            value: data.residents.length,
            sub: `${data.residents.filter((r) => r.isOwner).length} owners`,
            icon: MdPeople,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Residences",
            value: data.residences.length,
            sub: `${occupancyRate}% occupied`,
            icon: MdHome,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Total Invoices",
            value: data.invoices.length,
            sub: `${data.invoices.filter((i) => i.status === "Paid").length} paid`,
            icon: MdReceipt,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Vehicles",
            value: data.vehicles.length,
            sub: "Registered",
            icon: MdDirectionsCar,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-4"
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                  }}
                >
                  <Icon size={18} style={{ color: card.color }} />
                </div>
              </div>
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
                  fontWeight: "700",
                  color: "#64748b",
                  marginTop: "3px",
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Occupancy & Rates */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Performance Rates
          </p>
          <div className="space-y-4">
            {[
              {
                label: "Occupancy Rate",
                value: occupancyRate,
                color: "#16a34a",
                sub: `${data.residences.filter((r) => r.isOccupied).length}/${data.residences.length} residences`,
              },
              {
                label: "Problem Resolution Rate",
                value: resolvedRate,
                color: "#2563eb",
                sub: `${data.problemReports.filter((p) => p.status === "Resolved").length}/${data.problemReports.length} resolved`,
              },
              {
                label: "Reservation Approval Rate",
                value: approvalRate,
                color: "#7c3aed",
                sub: `${data.reservations.filter((r) => r.status === "Approved").length}/${data.reservations.length} approved`,
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1.5">
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      {item.label}
                    </span>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginTop: "1px",
                      }}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: item.color,
                    }}
                  >
                    {item.value}%
                  </span>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ background: "#f1f5f9", height: "8px" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PR breakdown */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Problem Reports Breakdown
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Pending",
                value: data.problemReports.filter((p) => p.status === "Pending")
                  .length,
                total: data.problemReports.length,
                color: "#d97706",
                bg: "#fffbeb",
                border: "#fde68a",
              },
              {
                label: "In Progress",
                value: data.problemReports.filter(
                  (p) => p.status === "InProgress",
                ).length,
                total: data.problemReports.length,
                color: "#2563eb",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                label: "Resolved",
                value: data.problemReports.filter(
                  (p) => p.status === "Resolved",
                ).length,
                total: data.problemReports.length,
                color: "#16a34a",
                bg: "#f0fdf4",
                border: "#bbf7d0",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <MdBuild size={16} style={{ color: item.color }} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                    }}
                  >
                    / {item.total}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Reservations summary */}
          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#0f172a",
              margin: "16px 0",
            }}
          >
            Reservations Summary
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Pending",
                value: data.reservations.filter((r) => r.status === "Pending")
                  .length,
                color: "#d97706",
                bg: "#fffbeb",
                border: "#fde68a",
              },
              {
                label: "Approved",
                value: data.reservations.filter((r) => r.status === "Approved")
                  .length,
                color: "#16a34a",
                bg: "#f0fdf4",
                border: "#bbf7d0",
              },
              {
                label: "Rejected",
                value: data.reservations.filter((r) => r.status === "Rejected")
                  .length,
                color: "#dc2626",
                bg: "#fef2f2",
                border: "#fecaca",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <MdEventAvailable size={16} style={{ color: item.color }} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: item.color,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
