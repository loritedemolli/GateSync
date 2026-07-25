import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdHome,
  MdReceipt,
  MdPayment,
  MdBuild,
  MdEventAvailable,
  MdDirectionsCar,
  MdNotifications,
  MdAssessment,
  MdLogout,
  MdSettings,
  MdAdminPanelSettings,
  MdPerson,
} from "react-icons/md";

const allMenuItems = [
  // SuperAdmin + Admin
  {
    path: "/dashboard",
    icon: MdDashboard,
    label: "Dashboard",
    roles: ["SuperAdmin", "Admin", "Resident", "Security", "Maintenance"],
  },
  {
    path: "/users",
    icon: MdAdminPanelSettings,
    label: "Users",
    roles: ["SuperAdmin"],
  },
  {
    path: "/residents",
    icon: MdPeople,
    label: "Residents",
    roles: ["SuperAdmin", "Admin", "Security"],
  },
  {
    path: "/residences",
    icon: MdHome,
    label: "Residences",
    roles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/invoices",
    icon: MdReceipt,
    label: "Invoices",
    roles: ["SuperAdmin", "Admin", "Resident"],
  },
  {
    path: "/payments",
    icon: MdPayment,
    label: "Payments",
    roles: ["SuperAdmin", "Admin", "Resident"],
  },
  {
    path: "/problem-reports",
    icon: MdBuild,
    label: "Problem Reports",
    roles: ["SuperAdmin", "Admin", "Resident", "Maintenance"],
  },
  {
    path: "/reservations",
    icon: MdEventAvailable,
    label: "Reservations",
    roles: ["SuperAdmin", "Admin", "Resident"],
  },
  {
    path: "/vehicles",
    icon: MdDirectionsCar,
    label: "Vehicles",
    roles: ["SuperAdmin", "Admin", "Security"],
  },
  {
    path: "/notifications",
    icon: MdNotifications,
    label: "Notifications",
    roles: ["SuperAdmin", "Admin", "Resident", "Security", "Maintenance"],
  },
  {
    path: "/reports",
    icon: MdAssessment,
    label: "Reports",
    roles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/my-profile",
    icon: MdPerson,
    label: "My Profile",
    roles: ["Resident"],
  },
  {
    path: "/my-vehicles",
    icon: MdDirectionsCar,
    label: "My Vehicles",
    roles: ["Resident"],
  },
];

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <div
      className="w-64 min-h-screen flex flex-col flex-shrink-0"
      style={{
        background:
          "linear-gradient(160deg, #052e16 0%, #14532d 50%, #166534 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base text-white"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
            }}
          >
            GS
          </div>
          <div>
            <h1 className="font-black text-white text-lg tracking-tight">
              GateSync
            </h1>
            <p className="text-xs font-medium" style={{ color: "#4ade80" }}>
              Neighborhood Management
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-6 mb-4"
        style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
      />

      {/* User Info */}
      <div className="mx-4 mb-5">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              {user?.fullName || user?.username}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <p className="text-xs font-medium" style={{ color: "#4ade80" }}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
        <p
          className="text-xs font-bold uppercase px-3 mb-3"
          style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}
        >
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
                    }
                  : { color: "rgba(255,255,255,0.6)" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={
                  isActive
                    ? { background: "rgba(255,255,255,0.2)" }
                    : { background: "rgba(255,255,255,0.06)" }
                }
              >
                <Icon size={17} />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1">
        <div
          className="mx-0 mb-2"
          style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
        />

        {/* Settings — vetëm SuperAdmin */}
        {user?.role === "SuperAdmin" && (
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <MdSettings size={17} />
            </div>
            <span>Settings</span>
          </Link>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <MdLogout size={17} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
