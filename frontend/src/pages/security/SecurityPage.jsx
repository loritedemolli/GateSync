import { useState } from "react";
import {
  MdSearch,
  MdPeople,
  MdDirectionsCar,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdPhone,
  MdHome,
} from "react-icons/md";
import api from "../../services/api";

function SecurityPage() {
  const [residentSearch, setResidentSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [residentResult, setResidentResult] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);
  const [residentStatus, setResidentStatus] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState(null);
  const [loadingResident, setLoadingResident] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  const searchResident = async () => {
    if (!residentSearch.trim()) return;
    setLoadingResident(true);
    setResidentResult(null);
    setResidentStatus(null);
    try {
      const res = await api.get("/residents");
      const found = res.data.filter(
        (r) =>
          r.fullName?.toLowerCase().includes(residentSearch.toLowerCase()) ||
          r.phoneNumber?.includes(residentSearch),
      );
      setResidentResult(found);
      setResidentStatus(found.length > 0 ? "found" : "notfound");
    } catch {
      setResidentStatus("error");
    } finally {
      setLoadingResident(false);
    }
  };

  const searchVehicle = async () => {
    if (!vehicleSearch.trim()) return;
    setLoadingVehicle(true);
    setVehicleResult(null);
    setVehicleStatus(null);
    try {
      const res = await api.get("/vehicles");
      const found = res.data.filter((v) =>
        v.plateNumber?.toLowerCase().includes(vehicleSearch.toLowerCase()),
      );
      setVehicleResult(found);
      setVehicleStatus(found.length > 0 ? "found" : "notfound");
    } catch {
      setVehicleStatus("error");
    } finally {
      setLoadingVehicle(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Gate Control
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          Verify residents and vehicles at the gate
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resident verification */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <MdPeople size={20} style={{ color: "#2563eb" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Resident Verification
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: "500",
                }}
              >
                Search by name or phone number
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-3 rounded-xl flex-1"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <MdSearch size={18} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Name or phone number..."
                value={residentSearch}
                onChange={(e) => setResidentSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchResident()}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0f172a",
                  width: "100%",
                }}
              />
            </div>
            <button
              onClick={searchResident}
              disabled={loadingResident}
              className="px-5 py-3 rounded-xl text-white font-bold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingResident ? "..." : "Search"}
            </button>
          </div>

          {/* Result */}
          {residentStatus === "notfound" && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <MdCancel size={24} style={{ color: "#dc2626", flexShrink: 0 }} />
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#dc2626",
                  }}
                >
                  Not a resident
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  This person is not registered in the system.
                </p>
              </div>
            </div>
          )}

          {residentStatus === "found" && residentResult && (
            <div className="space-y-3">
              {residentResult.map((r) => (
                <div
                  key={r.residentId}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #bbf7d0" }}
                >
                  {/* Green header */}
                  <div
                    className="flex items-center gap-3 p-4"
                    style={{ background: "#f0fdf4" }}
                  >
                    <MdCheckCircle
                      size={22}
                      style={{ color: "#16a34a", flexShrink: 0 }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#15803d",
                      }}
                    >
                      Verified Resident
                    </p>
                  </div>
                  {/* Details */}
                  <div className="p-4 space-y-3">
                    {[
                      { icon: MdPerson, label: "Full Name", value: r.fullName },
                      { icon: MdPhone, label: "Phone", value: r.phoneNumber },
                      {
                        icon: MdHome,
                        label: "Residence",
                        value: r.residenceAddress || "Not assigned",
                      },
                    ].map((detail) => {
                      const Icon = detail.icon;
                      return (
                        <div
                          key={detail.label}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                            }}
                          >
                            <Icon size={13} style={{ color: "#16a34a" }} />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              {detail.label}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#0f172a",
                              }}
                            >
                              {detail.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold mt-1"
                      style={{
                        background: r.isOwner ? "#eff6ff" : "#f5f3ff",
                        color: r.isOwner ? "#2563eb" : "#7c3aed",
                        border: `1px solid ${r.isOwner ? "#bfdbfe" : "#ddd6fe"}`,
                      }}
                    >
                      {r.isOwner ? "Owner" : "Tenant"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* vehicle verification */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <MdDirectionsCar size={20} style={{ color: "#16a34a" }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                Vehicle Verification
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: "500",
                }}
              >
                Search by plate number
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-3 rounded-xl flex-1"
              style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
            >
              <MdSearch size={18} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Plate number e.g. 01-234-AA"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && searchVehicle()}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0f172a",
                  width: "100%",
                  textTransform: "uppercase",
                }}
              />
            </div>
            <button
              onClick={searchVehicle}
              disabled={loadingVehicle}
              className="px-5 py-3 rounded-xl text-white font-bold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingVehicle ? "..." : "Search"}
            </button>
          </div>

          {/* Result */}
          {vehicleStatus === "notfound" && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <MdCancel size={24} style={{ color: "#dc2626", flexShrink: 0 }} />
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "#dc2626",
                  }}
                >
                  Vehicle not registered
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  This vehicle is not in the system.
                </p>
              </div>
            </div>
          )}

          {vehicleStatus === "found" && vehicleResult && (
            <div className="space-y-3">
              {vehicleResult.map((v) => (
                <div
                  key={v.vehicleId}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #bbf7d0" }}
                >
                  <div
                    className="flex items-center gap-3 p-4"
                    style={{ background: "#f0fdf4" }}
                  >
                    <MdCheckCircle
                      size={22}
                      style={{ color: "#16a34a", flexShrink: 0 }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#15803d",
                      }}
                    >
                      Registered Vehicle
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1.5 rounded-lg text-sm font-black"
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
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {v.brand} {v.modelName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        <MdPerson size={13} style={{ color: "#16a34a" }} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            fontWeight: "600",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Owner
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#0f172a",
                          }}
                        >
                          {v.residentName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;
