import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdHome,
  MdReceipt,
  MdDirectionsCar,
  MdBuild,
  MdEventAvailable,
  MdNotifications,
  MdArrowForward,
  MdBarChart,
} from "react-icons/md";

const showcaseItems = [
  {
    icon: MdPeople,
    color: "#22c55e",
    title: "Manage residents",
    desc: "Register residents, assign residences and track ownership status.",
    stats: [
      { label: "Total", value: "248" },
      { label: "Active", value: "231" },
      { label: "Owners", value: "89" },
    ],
    rows: [
      {
        name: "John Smith",
        sub: "Apt 4B",
        badge: "Owner",
        badgeColor: "#22c55e",
      },
      {
        name: "Sara Johnson",
        sub: "Apt 2A",
        badge: "Tenant",
        badgeColor: "#3b82f6",
      },
      {
        name: "Mark Davis",
        sub: "Apt 7C",
        badge: "Owner",
        badgeColor: "#22c55e",
      },
    ],
  },
  {
    icon: MdReceipt,
    color: "#3b82f6",
    title: "Track invoices",
    desc: "Create monthly invoices and monitor payment status automatically.",
    stats: [
      { label: "Collected", value: "$14.2k" },
      { label: "Pending", value: "$4.2k" },
      { label: "Overdue", value: "$1.1k" },
    ],
    rows: [
      {
        name: "Apt 4B · January",
        sub: "$150.00",
        badge: "Paid",
        badgeColor: "#22c55e",
      },
      {
        name: "Apt 2A · January",
        sub: "$150.00",
        badge: "Pending",
        badgeColor: "#f59e0b",
      },
      {
        name: "Apt 7C · January",
        sub: "$150.00",
        badge: "Overdue",
        badgeColor: "#ef4444",
      },
    ],
  },
  {
    icon: MdEventAvailable,
    color: "#a855f7",
    title: "Approve reservations",
    desc: "Residents book facilities. Approve or reject with a single click.",
    stats: [
      { label: "This month", value: "34" },
      { label: "Approved", value: "28" },
      { label: "Pending", value: "6" },
    ],
    rows: [
      {
        name: "Gym · Jan 28",
        sub: "John Smith",
        badge: "Approved",
        badgeColor: "#22c55e",
      },
      {
        name: "Pool · Jan 29",
        sub: "Sara Johnson",
        badge: "Pending",
        badgeColor: "#f59e0b",
      },
      {
        name: "Hall · Feb 1",
        sub: "Mark Davis",
        badge: "Approved",
        badgeColor: "#22c55e",
      },
    ],
  },
  {
    icon: MdBuild,
    color: "#f59e0b",
    title: "Resolve issues",
    desc: "Track maintenance reports from submission to resolution in real time.",
    stats: [
      { label: "Total", value: "18" },
      { label: "Resolved", value: "14" },
      { label: "In progress", value: "4" },
    ],
    rows: [
      {
        name: "Broken elevator",
        sub: "Building A",
        badge: "Resolved",
        badgeColor: "#22c55e",
      },
      {
        name: "Water leak",
        sub: "Apt 3B",
        badge: "In Progress",
        badgeColor: "#3b82f6",
      },
      {
        name: "Light outage",
        sub: "Parking",
        badge: "Pending",
        badgeColor: "#f59e0b",
      },
    ],
  },
];

function AnimatedShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const modules = [
    { icon: MdPeople, label: "Residents", color: "#22c55e", angle: 0 },
    { icon: MdReceipt, label: "Invoices", color: "#3b82f6", angle: 60 },
    {
      icon: MdEventAvailable,
      label: "Reservations",
      color: "#a855f7",
      angle: 120,
    },
    { icon: MdBuild, label: "Maintenance", color: "#f59e0b", angle: 180 },
    { icon: MdDirectionsCar, label: "Vehicles", color: "#0ea5e9", angle: 240 },
    {
      icon: MdNotifications,
      label: "Notifications",
      color: "#ec4899",
      angle: 300,
    },
  ];

  const radius = 130;
  const cx = 180;
  const cy = 180;

  return (
    <div
      className="relative hidden lg:flex items-center justify-center fade-up-4"
      style={{ width: "360px", height: "360px" }}
    >
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }
        @keyframes counter-orbit {
          from { transform: rotate(0deg) }
          to { transform: rotate(-360deg) }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3 }
          50% { transform: scale(1.08); opacity: 0.6 }
        }
        .orbit-container { animation: orbit 20s linear infinite }
        .orbit-container:hover { animation-play-state: paused }
        .icon-counter { animation: counter-orbit 20s linear infinite }
        .orbit-container:hover .icon-counter { animation-play-state: paused }
      `}</style>

      {/* Outer glow rings */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "340px",
          height: "340px",
          top: "10px",
          left: "10px",
          border: "1px solid rgba(34,197,94,0.08)",
          animation: "pulse-ring 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "280px",
          height: "280px",
          top: "40px",
          left: "40px",
          border: "1px solid rgba(34,197,94,0.06)",
          animation: "pulse-ring 4s ease-in-out infinite 1s",
        }}
      />

      {/* Orbit path */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          top: `${cy - radius}px`,
          left: `${cx - radius}px`,
          border: "1px dashed rgba(255,255,255,0.06)",
        }}
      />

      {/* Center */}
      <div
        className="absolute flex items-center justify-center rounded-full z-10"
        style={{
          width: "72px",
          height: "72px",
          top: `${cy - 36}px`,
          left: `${cx - 36}px`,
          background: "linear-gradient(135deg, #22c55e, #15803d)",
          boxShadow:
            "0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.15)",
        }}
      >
        <span className="text-white font-black text-lg">GS</span>
      </div>

      {/* Orbiting modules */}
      <div
        className="orbit-container absolute"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          top: `${cy - radius}px`,
          left: `${cx - radius}px`,
        }}
      >
        {modules.map((mod, i) => {
          const rad = (mod.angle * Math.PI) / 180;
          const x = radius + radius * Math.cos(rad) - 22;
          const y = radius + radius * Math.sin(rad) - 22;
          const Icon = mod.icon;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={i}
              className="absolute icon-counter"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: "44px",
                height: "44px",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Module button */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all"
                style={{
                  background: isHovered
                    ? `${mod.color}30`
                    : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isHovered ? mod.color : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isHovered ? `0 0 20px ${mod.color}40` : "none",
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isHovered ? mod.color : "rgba(255,255,255,0.5)",
                  }}
                />
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute z-50 px-3 py-1.5 rounded-xl text-xs font-bold text-white whitespace-nowrap"
                  style={{
                    background: "rgba(15,23,42,0.95)",
                    border: `1px solid ${mod.color}40`,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
                    top: "-36px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: mod.color,
                  }}
                >
                  {mod.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Connection lines from center to each module */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: "360px",
          height: "360px",
          top: 0,
          left: 0,
          opacity: 0.08,
        }}
      >
        {modules.map((mod, i) => {
          const rad = (mod.angle * Math.PI) / 180;
          const x2 = cx + radius * Math.cos(rad);
          const y2 = cy + radius * Math.sin(rad);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={mod.color}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
    </div>
  );
}
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans" style={{ background: "#0a0a0a" }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4 }
          50% { opacity: 0.8 }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .fade-up { animation: fadeSlideUp 0.7s ease forwards }
        .fade-up-1 { animation: fadeSlideUp 0.7s 0.1s ease both }
        .fade-up-2 { animation: fadeSlideUp 0.7s 0.25s ease both }
        .fade-up-3 { animation: fadeSlideUp 0.7s 0.4s ease both }
        .fade-up-4 { animation: fadeSlideUp 0.7s 0.55s ease both }
      `}</style>

      {/*NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
            style={{
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 0 20px rgba(34,197,94,0.3)",
            }}
          >
            GS
          </div>
          <span className="text-lg font-black text-white">GateSync</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => (e.target.style.color = "#4ade80")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.45)")
              }
            >
              {item}
            </a>
          ))}
        </div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #22c55e, #15803d)",
            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
          }}
        >
          Sign In <MdArrowForward size={15} />
        </button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 50%, #0a1628 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${[2, 3, 2, 4, 2, 3, 2, 3][i]}px`,
              height: `${[2, 3, 2, 4, 2, 3, 2, 3][i]}px`,
              background: "#22c55e",
              opacity: [0.3, 0.15, 0.4, 0.1, 0.25, 0.2, 0.35, 0.15][i],
              top: `${[10, 65, 30, 80, 20, 50, 75, 40][i]}%`,
              left: `${[15, 70, 80, 20, 45, 35, 60, 90][i]}%`,
              animation: `pulse-glow ${[3, 4, 3.5, 5, 4, 3, 4.5, 3.5][i]}s ease-in-out infinite`,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-8 pt-24 pb-16 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-bold"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Neighborhood Management Platform
            </div>

            <h1
              className="fade-up-1 text-6xl font-black text-white leading-tight mb-6"
              style={{ letterSpacing: "-1.5px" }}
            >
              Manage your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                neighborhood
              </span>
              <br />
              smarter.
            </h1>

            <p
              className="fade-up-2 text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "rgba(255,255,255,0.5)", fontWeight: "400" }}
            >
              A complete digital platform for gated communities — residents,
              invoices, reservations, vehicles, and security. All in one place.
            </p>

            <div className="fade-up-3 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-bold transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
                  fontSize: "15px",
                }}
              >
                Get Started <MdArrowForward size={18} />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Right animated sshowcase */}
          <div className="hidden lg:flex items-center justify-end fade-up-4">
            <AnimatedShowcase />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-24 px-8"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0d1a0d 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Everything you need
            </span>
            <h2
              className="text-4xl font-black text-white mb-4"
              style={{ letterSpacing: "-1px" }}
            >
              Built for modern neighborhoods
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Every feature your community needs, designed to work together
              seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: MdPeople,
                title: "Resident Management",
                desc: "Register and manage all residents with their residence assignments, ownership status, and personal details.",
                color: "#22c55e",
              },
              {
                icon: MdReceipt,
                title: "Invoices & Payments",
                desc: "Create monthly invoices, track payment status, and manage overdue accounts with ease.",
                color: "#3b82f6",
              },
              {
                icon: MdEventAvailable,
                title: "Facility Reservations",
                desc: "Residents book shared spaces like gyms and event halls. Admins approve or reject requests instantly.",
                color: "#a855f7",
              },
              {
                icon: MdBuild,
                title: "Problem Reporting",
                desc: "Residents report maintenance issues. Track status from pending to resolved, assign to maintenance staff.",
                color: "#f59e0b",
              },
              {
                icon: MdDirectionsCar,
                title: "Vehicle Registry",
                desc: "Maintain a complete registry of resident vehicles. Security can verify vehicles at the gate instantly.",
                color: "#0ea5e9",
              },
              {
                icon: MdNotifications,
                title: "Notifications",
                desc: "Send announcements to all residents or specific individuals. Keep everyone informed in real time.",
                color: "#ec4899",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl transition-all cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = `${feature.color}40`;
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${feature.color}15`,
                      border: `1px solid ${feature.color}25`,
                    }}
                  >
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* how it works*/}
      <section
        id="how-it-works"
        className="py-24 px-8"
        style={{ background: "#0a0a0a" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Simple workflow
            </span>
            <h2
              className="text-4xl font-black text-white mb-4"
              style={{ letterSpacing: "-1px" }}
            >
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div
              className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px"
              style={{
                background:
                  "linear-gradient(to right, rgba(34,197,94,0.5), rgba(34,197,94,0.5))",
              }}
            />
            {[
              {
                step: "01",
                icon: MdHome,
                title: "Configure your neighborhood",
                desc: "Set up countries, cities, neighborhoods and residences. Structure your community exactly as it is.",
              },
              {
                step: "02",
                icon: MdPeople,
                title: "Register residents",
                desc: "Add residents and assign them to residences. They get credentials and access their personal portal immediately.",
              },
              {
                step: "03",
                icon: MdBarChart,
                title: "Manage everything",
                desc: "Issue invoices, approve reservations, handle problem reports, and communicate with all residents from one dashboard.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative text-center p-6 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                      boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
                    }}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <span
                    className="inline-block text-xs font-black mb-3 px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "#4ade80",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    Step {step.step}
                  </span>
                  <h3 className="text-base font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* cta */}
      <section
        className="py-24 px-8"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #0d1a0d 100%)",
        }}
      >
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-16 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.1) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <h2
              className="text-5xl font-black text-white mb-6"
              style={{ letterSpacing: "-1px" }}
            >
              Ready to get started?
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Join GateSync and bring your neighborhood management into the
              modern era.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
                  fontSize: "15px",
                }}
              >
                Create an account <MdArrowForward size={18} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*FOOTER */}
      <footer
        className="py-6 px-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
          >
            GS
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            GateSync
          </span>
        </div>
      </footer>
    </div>
  );
}
