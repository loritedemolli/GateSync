import { useState, useEffect } from "react";
import {
  MdReceipt,
  MdSearch,
  MdWarning,
  MdCheckCircle,
  MdPending,
  MdClose,
  MdCheck,
  MdCreditCard,
} from "react-icons/md";
import api from "../../services/api";

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paying, setPaying] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardError, setCardError] = useState("");

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

  useEffect(() => {
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

  const handlePay = (invoice) => {
    if (paying) return;
    setPayingInvoice(invoice);
    setCardData({ number: "", name: "", expiry: "", cvv: "" });
    setCardError("");
    setShowPayModal(true);
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
    return clean;
  };

  const validateCard = () => {
    const num = cardData.number.replace(/\s/g, "");
    if (num.length !== 16) return "Card number must be 16 digits!";
    if (!cardData.name || cardData.name.length < 3)
      return "Please enter cardholder name!";
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry))
      return "Expiry must be MM/YY format!";
    if (cardData.cvv.length !== 3) return "CVV must be 3 digits!";
    return null;
  };

  const confirmPay = async () => {
    if (paying) return;
    const cardErr = validateCard();
    if (cardErr) return setCardError(cardErr);

    setPaying(true);
    try {
      const profileRes = await api.get("/residents/my-profile");
      const residentId = profileRes.data.residentId;

      await api.post("/payments", {
        invoiceId: payingInvoice.invoiceId,
        residentId: residentId,
        paidAmount: payingInvoice.amount,
        method: 1,
      });
      await fetchData();
      setShowPayModal(false);
    } catch {
      setCardError("Payment failed. Please try again!");
    } finally {
      setPaying(false);
    }
  };

  const totalOwed = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

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

                <div className="flex items-center gap-3">
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

                  {item.status !== "Paid" && (
                    <button
                      onClick={() => handlePay(item)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #22c55e, #15803d)",
                        boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pay Modal */}
      {showPayModal && payingInvoice && (
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
                Pay Invoice
              </h2>
              <button
                onClick={() => !paying && setShowPayModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            {/* Amount */}
            <div
              className="rounded-2xl p-4 mb-5 flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, #14532d, #16a34a)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  AMOUNT
                </p>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "900",
                    color: "white",
                  }}
                >
                  ${payingInvoice.amount?.toFixed(2)}
                </p>
              </div>
              <MdCreditCard
                size={32}
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
            </div>

            {cardError && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                }}
              >
                {cardError}
              </div>
            )}

            <div className="space-y-3 mb-5">
              {/* Card Number */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "6px",
                  }}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardData.number}
                  onChange={(e) =>
                    setCardData((p) => ({
                      ...p,
                      number: formatCardNumber(e.target.value),
                    }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "6px",
                  }}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData((p) => ({ ...p, name: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "6px",
                    }}
                  >
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData((p) => ({
                        ...p,
                        expiry: formatExpiry(e.target.value),
                      }))
                    }
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
                      marginBottom: "6px",
                    }}
                  >
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData((p) => ({
                        ...p,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                      }))
                    }
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => !paying && setShowPayModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                  cursor: paying ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPay}
                disabled={paying}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: paying
                    ? "#86efac"
                    : "linear-gradient(135deg, #22c55e, #15803d)",
                  boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                  border: "none",
                  cursor: paying ? "not-allowed" : "pointer",
                }}
              >
                <MdCheck size={16} />
                {paying ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyInvoices;
