import { useState, useEffect } from "react";
import { MdNotifications, MdSearch, MdCheckCircle } from "react-icons/md";
import api from "../../services/api";

function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/notifications/my");
        setNotifications(res.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = notifications.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.message?.toLowerCase().includes(search.toLowerCase()),
  );

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
          My Notifications
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          {notifications.length} notifications
        </p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl mb-5"
        style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
      >
        <MdSearch size={17} style={{ color: "#94a3b8" }} />
        <input
          type="text"
          placeholder="Search notifications..."
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

      {/* List */}
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
              No notifications
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.notificationId}
              className="flex items-start gap-4 p-4 rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <MdNotifications size={20} style={{ color: "#16a34a" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.title}
                  </p>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                    }}
                  >
                    {item.sentAt
                      ? new Date(item.sentAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500",
                    lineHeight: "1.5",
                  }}
                >
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyNotifications;
