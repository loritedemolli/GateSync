import { useState, useEffect } from "react";
import {
  MdPeople,
  MdDirectionsCar,
  MdNotifications,
  MdSearch,
  MdSecurity,
  MdHome,
} from "react-icons/md";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function SecurityDashboard() {
  const { user } = useAuth();
  const [residents, setResidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResident, setSearchResident] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [residentsRes, vehiclesRes, notificationsRes] = await Promise.all(
          [
            api.get("/residents"),
            api.get("/vehicles"),
            api.get("/notifications/my"),
          ],
        );
        setResidents(residentsRes.data);
        setVehicles(vehiclesRes.data);
        setNotifications(notificationsRes.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResidents = residents.filter(
    (r) =>
      r.fullName?.toLowerCase().includes(searchResident.toLowerCase()) ||
      r.phoneNumber?.includes(searchResident),
  );

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plateNumber?.toLowerCase().includes(searchVehicle.toLowerCase()) ||
      v.brand?.toLowerCase().includes(searchVehicle.toLowerCase()) ||
      v.residentName?.toLowerCase().includes(searchVehicle.toLowerCase()),
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
      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <MdSecurity size={28} className="text-white" />
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
              Security Dashboard
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
            label: "Total Residents",
            value: residents.length,
            icon: MdPeople,
            color: "#2563eb",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Registered Vehicles",
            value: vehicles.length,
            icon: MdDirectionsCar,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            label: "Notifications",
            value: notifications.length,
            icon: MdNotifications,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Residents */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <MdPeople size={18} style={{ color: "#2563eb" }} />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Residents
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                }}
              >
                {filteredResidents.length}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="p-3" style={{ borderBottom: "1px solid #f8fafc" }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <MdSearch size={15} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchResident}
                onChange={(e) => setSearchResident(e.target.value)}
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
          </div>

          {/* List */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {filteredResidents.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <MdPeople size={32} style={{ color: "#e2e8f0" }} />
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  No residents found
                </p>
              </div>
            ) : (
              filteredResidents.map((r, i) => (
                <div
                  key={r.residentId}
                  className="flex items-center gap-3 px-4 py-3 transition-all"
                  style={{
                    borderBottom:
                      i < filteredResidents.length - 1
                        ? "1px solid #f8fafc"
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                    }}
                  >
                    {r.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {r.fullName}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                      }}
                    >
                      {r.phoneNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="px-2 py-0.5 rounded-lg text-xs font-bold"
                      style={{
                        background: r.isOwner ? "#eff6ff" : "#f5f3ff",
                        color: r.isOwner ? "#2563eb" : "#7c3aed",
                        border: `1px solid ${r.isOwner ? "#bfdbfe" : "#ddd6fe"}`,
                      }}
                    >
                      {r.isOwner ? "Owner" : "Tenant"}
                    </span>
                    {r.residenceAddress && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          fontWeight: "500",
                        }}
                      >
                        {r.residenceAddress}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vehicles */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <MdDirectionsCar size={18} style={{ color: "#16a34a" }} />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Vehicles
              </p>
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                }}
              >
                {filteredVehicles.length}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="p-3" style={{ borderBottom: "1px solid #f8fafc" }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <MdSearch size={15} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search by plate, brand or resident..."
                value={searchVehicle}
                onChange={(e) => setSearchVehicle(e.target.value)}
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
          </div>

          {/* List */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {filteredVehicles.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <MdDirectionsCar size={32} style={{ color: "#e2e8f0" }} />
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  No vehicles found
                </p>
              </div>
            ) : (
              filteredVehicles.map((v, i) => (
                <div
                  key={v.vehicleId}
                  className="flex items-center gap-3 px-4 py-3 transition-all"
                  style={{
                    borderBottom:
                      i < filteredVehicles.length - 1
                        ? "1px solid #f8fafc"
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <MdDirectionsCar size={18} style={{ color: "#374151" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-lg text-xs font-black"
                        style={{
                          background: "#0f172a",
                          color: "white",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {v.plateNumber}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {v.brand} {v.modelName}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        marginTop: "2px",
                      }}
                    >
                      {v.residentName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div
          className="mt-6 rounded-2xl p-5"
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

export default SecurityDashboard;
