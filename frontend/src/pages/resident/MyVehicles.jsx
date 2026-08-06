import { useState, useEffect } from "react";
import {
  MdDirectionsCar,
  MdAdd,
  MdDelete,
  MdClose,
  MdCheck,
  MdSearch,
} from "react-icons/md";
import api from "../../services/api";

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: "",
    brand: "",
    model: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/vehicles/my");
      setVehicles(res.data);
    } catch {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = vehicles.filter(
    (v) =>
      v.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase()) ||
      v.modelName?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async () => {
    if (!formData.plateNumber) return setError("Plate number is required!");
    if (!formData.brand) return setError("Brand is required!");
    if (!formData.model) return setError("Model is required!");

    setSaving(true);
    try {
      const profileRes = await api.get("/residents/my-profile");
      const residentId = profileRes.data.residentId;

      await api.post("/vehicles", {
        plateNumber: formData.plateNumber,
        brand: formData.brand,
        modelName: formData.model,
        residentId: residentId,
      });
      await fetchData();
      setShowModal(false);
      setFormData({ plateNumber: "", brand: "", model: "" });
    } catch {
      setError("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/vehicles/${selected.vehicleId}`);
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
            My Vehicles
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "3px",
              fontWeight: "500",
            }}
          >
            {vehicles.length} registered vehicles
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError("");
            setFormData({ plateNumber: "", brand: "", model: "" });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #22c55e, #15803d)",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          }}
        >
          <MdAdd size={18} /> Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl mb-5"
        style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}
      >
        <MdSearch size={17} style={{ color: "#94a3b8" }} />
        <input
          type="text"
          placeholder="Search by plate, brand or model..."
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

      {/* Vehicles List */}
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
            <MdDirectionsCar size={40} style={{ color: "#e2e8f0" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#94a3b8",
                marginTop: "12px",
              }}
            >
              No vehicles registered
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.vehicleId}
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
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <MdDirectionsCar size={22} style={{ color: "#374151" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-xs font-black"
                      style={{
                        background: "#0f172a",
                        color: "white",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.plateNumber}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {item.brand} {item.modelName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelected(item);
                  setShowDeleteModal(true);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <MdDelete size={14} style={{ color: "#dc2626" }} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
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
                Add Vehicle
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <MdClose size={15} style={{ color: "#64748b" }} />
              </button>
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

            <div className="space-y-4 mb-5">
              <div>
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
                  Plate Number
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      plateNumber: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g. 01-234-AA"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                  }}
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
                    marginBottom: "8px",
                  }}
                >
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, brand: e.target.value }))
                  }
                  placeholder="e.g. Toyota, BMW..."
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                  }}
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
                    marginBottom: "8px",
                  }}
                >
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, model: e.target.value }))
                  }
                  placeholder="e.g. Corolla, X5..."
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22c55e";
                    e.target.style.background = "#f0fdf4";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
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
                {saving ? "Saving..." : "Add Vehicle"}
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
                Remove Vehicle
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Are you sure you want to remove{" "}
                <strong style={{ color: "#0f172a" }}>
                  {selected?.plateNumber}
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyVehicles;
