"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    navigate("/admin/login")
  }

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/payments", label: "Payments", icon: "💳" },
    { path: "/admin/uploads", label: "Uploads", icon: "📤" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:bg-gray-700 p-2 rounded">
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    location.pathname === item.path ? "bg-blue-600 text-white" : "hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 transition"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Regent Payment Gateway Dashboard</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
