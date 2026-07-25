import { useState, useEffect } from "react";
import {
  MdReceipt,
  MdSearch,
  MdWarning,
  MdCheckCircle,
  MdPending,
} from "react-icons/md";
import api from "../../services/api";

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/invoices/my");
        setInvoices(res.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.residenceAddress
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = !filterStatus || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return {
          bg: "#f0fdf4",
          color: "#16a34a",
          border: "#bbf7d0",
          icon: MdCheckCircle,
        };
      case "Pending":
        return {
          bg: "#fffbeb",
          color: "#d97706",
          border: "#fde68a",
          icon: MdPending,
        };
      case "Overdue":
        return {
          bg: "#fef2f2",
          color: "#dc2626",
          border: "#fecaca",
          icon: MdWarning,
        };
      default:
        return {
          bg: "#f8fafc",
          color: "#64748b",
          border: "#e2e8f0",
          icon: MdReceipt,
        };
    }
  };

  const totalOwed = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

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
          My Invoices
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          {invoices.length} total · ${totalOwed.toFixed(2)} owed · $
          {totalPaid.toFixed(2)} paid
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pending",
            value: invoices.filter((i) => i.status === "Pending").length,
            color: "#d97706",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Paid",
            value: invoices.filter((i) => i.status === "Paid").length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Overdue",
            value: invoices.filter((i) => i.status === "Overdue").length,
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
            placeholder="Search invoices..."
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
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices List */}
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
              No invoices found
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div
                key={item.invoiceId}
                className="flex items-center justify-between p-4 rounded-2xl transition-all"
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
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                    }}
                  >
                    <MdReceipt size={20} style={{ color: statusStyle.color }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: "#0f172a",
                      }}
                    >
                      ${item.amount?.toFixed(2)}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        marginTop: "2px",
                      }}
                    >
                      Due:{" "}
                      {item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  <StatusIcon size={12} />
                  {item.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyInvoices;
