import { useState, useEffect } from "react";
import {
  MdPayment,
  MdSearch,
  MdAttachMoney,
  MdCreditCard,
  MdAccountBalance,
  MdCheckCircle,
} from "react-icons/md";
import api from "../../services/api";

function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/payments/my");
        setPayments(res.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = payments.filter((p) => {
    const matchSearch = p.residentName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchMethod = !filterMethod || p.method === filterMethod;
    return matchSearch && matchMethod;
  });

  const getMethodStyle = (method) => {
    switch (method) {
      case "Cash":
        return {
          bg: "#f0fdf4",
          color: "#16a34a",
          border: "#bbf7d0",
          icon: MdAttachMoney,
        };
      case "Card":
        return {
          bg: "#eff6ff",
          color: "#2563eb",
          border: "#bfdbfe",
          icon: MdCreditCard,
        };
      case "BankTransfer":
        return {
          bg: "#f5f3ff",
          color: "#7c3aed",
          border: "#ddd6fe",
          icon: MdAccountBalance,
        };
      default:
        return {
          bg: "#f8fafc",
          color: "#64748b",
          border: "#e2e8f0",
          icon: MdPayment,
        };
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

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
          My Payments
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          {payments.length} total payments · ${totalPaid.toFixed(2)} paid
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Payments",
            value: payments.length,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Cash",
            value: payments.filter((p) => p.method === "Cash").length,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Card / Transfer",
            value: payments.filter((p) => p.method !== "Cash").length,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
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
            placeholder="Search payments..."
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
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
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
          <option value="">All Methods</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="BankTransfer">Bank Transfer</option>
        </select>
      </div>

      {/* Payments List */}
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
              No payments found
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const methodStyle = getMethodStyle(item.method);
            const Icon = methodStyle.icon;
            return (
              <div
                key={item.paymentId}
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
                      background: methodStyle.bg,
                      border: `1px solid ${methodStyle.border}`,
                    }}
                  >
                    <Icon size={20} style={{ color: methodStyle.color }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: "#16a34a",
                      }}
                    >
                      ${item.paidAmount?.toFixed(2)}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        marginTop: "2px",
                      }}
                    >
                      {item.paymentDate
                        ? new Date(item.paymentDate).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                  style={{
                    background: methodStyle.bg,
                    color: methodStyle.color,
                    border: `1px solid ${methodStyle.border}`,
                  }}
                >
                  <Icon size={12} />
                  {item.method}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyPayments;
