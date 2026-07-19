import { useState, useEffect } from "react";
import { MdSecurity, MdSearch } from "react-icons/md";
import api from "../../../services/api";

function RolesTab() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const roleColors = {
    SuperAdmin: { bg: "#fef3c7", color: "#d97706", border: "#fde68a" },
    Admin: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
    Resident: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    Security: { bg: "#fdf4ff", color: "#7c3aed", border: "#e9d5ff" },
    Maintenance: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  };

  const roleDescriptions = {
    SuperAdmin: "Full system access — manages everything including admins",
    Admin: "Manages residents, invoices, reservations and notifications",
    Resident: "Access to own profile, invoices, reservations and reports",
    Security: "Manages gate access, visitors and vehicle registry",
    Maintenance: "Handles and resolves problem reports",
  };

  return (
    <div>
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
            gridTemplateColumns: "1fr 2fr 120px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Role", "Description", "Status"].map((h) => (
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
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          roles.map((role, i) => {
            const colors = roleColors[role.name] || {
              bg: "#f8fafc",
              color: "#64748b",
              border: "#e2e8f0",
            };
            return (
              <div
                key={role.roleId}
                className="grid px-5 py-4 transition-all"
                style={{
                  gridTemplateColumns: "1fr 2fr 120px",
                  alignItems: "center",
                  borderBottom:
                    i < roles.length - 1 ? "1px solid #f8fafc" : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fafafa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <MdSecurity size={16} style={{ color: colors.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {role.name}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  {roleDescriptions[role.name] || "System role"}
                </span>

                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit"
                  style={{
                    background: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  Active
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RolesTab;
