import { useState } from "react";
import { MdPublic, MdLocationCity, MdSecurity } from "react-icons/md";
import CountriesTab from "./tabs/CountriesTab";
import CitiesTab from "./tabs/CitiesTab";
import RolesTab from "./tabs/RolesTab";

const tabs = [
  { id: "countries", label: "Countries", icon: MdPublic },
  { id: "cities", label: "Cities", icon: MdLocationCity },
  { id: "roles", label: "Roles", icon: MdSecurity },
];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("countries");

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
          Settings
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "3px",
            fontWeight: "500",
          }}
        >
          System configuration and management
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "#f1f5f9" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#0f172a" : "#64748b",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "countries" && <CountriesTab />}
      {activeTab === "cities" && <CitiesTab />}
      {activeTab === "roles" && <RolesTab />}
    </div>
  );
}

export default SettingsPage;
