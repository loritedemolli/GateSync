import { useState, useEffect } from "react";
import {
  MdEdit,
  MdDelete,
  MdSearch,
  MdPeople,
  MdClose,
  MdCheck,
  MdSecurity,
  MdPerson,
} from "react-icons/md";
import api from "../../services/api";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ roleId: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get("/users"),
        api.get("/roles"),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.username
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchRole = !filterRole || u.roleName === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleStyle = (role) => {
    switch (role) {
      case "SuperAdmin":
        return { bg: "#fef3c7", color: "#d97706", border: "#fde68a" };
      case "Admin":
        return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
      case "Resident":
        return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
      case "Security":
        return { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" };
      case "Maintenance":
        return { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
      default:
        return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
    }
  };

  const openEdit = (item) => {
    setSelected(item);
    setFormData({
      roleId: roles.find((r) => r.name === item.roleName)?.roleId || "",
    });
    setError("");
    setShowEditModal(true);
  };

  const openDelete = (item) => {
    setSelected(item);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (!formData.roleId) return setError("Please select a role!");
    setSaving(true);
    try {
      await api.put(`/users/${selected.userId}`, {
        username: selected.username,
        roleId: parseInt(formData.roleId),
      });
      await fetchData();
      setShowEditModal(false);
    } catch {
      setError("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selected.userId}`);
      await fetchData();
      setShowDeleteModal(false);
    } catch {
      setShowDeleteModal(false);
    }
  };

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

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Users
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {users.length} registered users
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {["SuperAdmin", "Admin", "Resident", "Security", "Maintenance"].map(
          (role) => {
            const style = getRoleStyle(role);
            const count = users.filter((u) => u.roleName === role).length;
            return (
              <div
                key={role}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "#fff",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: "1",
                  }}
                >
                  {count}
                </p>
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-bold mt-2 inline-block"
                  style={{
                    background: style.bg,
                    color: style.color,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  {role}
                </span>
              </div>
            );
          },
        )}
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
            placeholder="Search by username..."
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
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
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
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r.roleId} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
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
            gridTemplateColumns: "2fr 1fr 100px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {["Username", "Role", "Actions"].map((h) => (
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
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <MdPeople size={40} style={{ color: "#e2e8f0" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No users found
            </p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const roleStyle = getRoleStyle(item.roleName);
            return (
              <div
                key={item.userId}
                className="grid px-5 py-4 transition-all"
                style={{
                  gridTemplateColumns: "2fr 1fr 100px",
                  alignItems: "center",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f8fafc" : "none",
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
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                    }}
                  >
                    {item.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {item.username}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: "500",
                      }}
                    >
                      ID: #{item.userId}
                    </p>
                  </div>
                </div>

                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold w-fit flex items-center gap-1"
                  style={{
                    background: roleStyle.bg,
                    color: roleStyle.color,
                    border: `1px solid ${roleStyle.border}`,
                  }}
                >
                  <MdSecurity size={11} />
                  {item.roleName}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <MdEdit size={14} style={{ color: "#2563eb" }} />
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <MdDelete size={14} style={{ color: "#dc2626" }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit role mmodal */}
      {showEditModal && selected && (
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
                Change Role
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
            </div>

            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                }}
              >
                {selected.username?.charAt(0).toUpperCase()}
              </div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {selected.username}
              </p>
            </div>

            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                }}
              >
                {error}
              </div>
            )}

            <div className="mb-5">
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                New Role
              </label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({ roleId: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#22c55e";
                  e.target.style.background = "#f0fdf4";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f8fafc";
                }}
              >
                <option value="">Select role...</option>
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: saving
                    ? "#86efac"
                    : "linear-gradient(135deg, #22c55e, #15803d)",
                }}
              >
                <MdCheck size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
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
            <div className="text-center mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <MdDelete size={24} style={{ color: "#dc2626" }} />
              </div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Delete User
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to delete{" "}
                <strong style={{ color: "#0f172a" }}>
                  {selected?.username}
                </strong>
                ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
