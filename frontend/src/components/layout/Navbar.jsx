import {
  MdNotifications,
  MdSearch,
  MdEmail,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isResident = user?.role === "Resident";

  return (
    <div
      className="h-16 bg-white flex items-center justify-between px-6 flex-shrink-0"
      style={{
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left */}
      {!isResident ? (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-96"
          style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
        >
          <MdSearch size={20} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search residents, invoices, vehicles..."
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: "#374151" }}
          />
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
            Welcome, {user?.fullName || user?.username}
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Date — vetëm Admin/SuperAdmin */}
        {!isResident && (
          <div
            className="hidden lg:block text-sm font-medium"
            style={{ color: "#9ca3af" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        <div className="w-px h-6 mx-1" style={{ background: "#e5e7eb" }} />

        {/* Email vetem admin */}
        {!isResident && (
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
          >
            <MdEmail size={18} style={{ color: "#6b7280" }} />
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-50"
          style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
        >
          <MdNotifications size={18} style={{ color: "#6b7280" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500"
            style={{ boxShadow: "0 0 0 2px white" }}
          />
        </button>

        <div className="w-px h-6 mx-1" style={{ background: "#e5e7eb" }} />

        {/* Profile */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
          style={{ border: "1.5px solid #e5e7eb" }}
          onClick={() => (isResident ? navigate("/my-profile") : null)}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 2px 6px rgba(34,197,94,0.35)",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: "#111827" }}
            >
              {user?.fullName || user?.username}
            </p>
            <p className="text-xs font-semibold" style={{ color: "#22c55e" }}>
              {user?.role}
            </p>
          </div>
          <MdKeyboardArrowDown size={16} style={{ color: "#9ca3af" }} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
