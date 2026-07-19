import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar  fixed width */}
      <div className="flex-shrink-0" style={{ width: "256px" }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ minWidth: 0 }}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
