"use client"

import { useState, useEffect } from "react"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    airPayCount: 0,
    phonePeCount: 0,
    sabPaisaCount: 0,
    successCount: 0,
    initiatedCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/payments`)
      const data = await res.json()
      const successfulPayments = data.filter((p) => p.status === "success")
      const totalAmount = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0)
      const sabPaisaCount = data.filter((p) => p.gateway === "sabpaisa").length
      const phonePeCount = data.filter((p) => p.gateway === "phonepe").length
      const airPayCount = data.filter((p) => p.gateway === "airpay").length
      const successCount = successfulPayments.length
      const initiatedCount = data.filter((p) => p.status === "PENDING" || p.status === "initiated").length

      setStats({
        totalPayments: successCount,
        totalAmount,
        sabPaisaCount,
        phonePeCount,
        airPayCount,
        successCount,
        initiatedCount,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div
      className={`bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 ${color} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs md:text-sm font-medium truncate">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1 md:mt-2 break-words">{value}</p>
        </div>
        <div className="text-3xl md:text-4xl ml-2 flex-shrink-0">{icon}</div>
      </div>
    </div>
  )

  const GatewayBar = ({ name, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-base text-gray-700 font-medium truncate">{name}</span>
          <span className="text-sm md:text-base font-semibold text-gray-900 ml-2">{count}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden shadow-inner">
          <div
            className={`${color} h-full rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {/* <p className="text-xs md:text-sm text-gray-500 mt-1.5 font-medium">{percentage.toFixed(1)}%</p> */}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-lg md:text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-0">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Payments" value={stats.totalPayments} icon="📊" color="border-blue-500" />
        <StatCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toLocaleString()}`}
          icon="💰"
          color="border-green-500"
        />
        <StatCard title="Successful" value={stats.successCount} icon="✅" color="border-emerald-500" />
        <StatCard title="SabPaisa Payments" value={stats.sabPaisaCount} icon="💳" color="border-purple-500" />
        <StatCard title="PhonePe Payments" value={stats.phonePeCount} icon="📱" color="border-indigo-500" />
        <StatCard title="Airpay Payments" value={stats.airPayCount} icon="✈️" color="border-cyan-500" />
      </div>

      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
          Gateway Distribution
        </h3>
        <div className="flex flex-col md:flex-row gap-6 md:gap-6 lg:gap-8">
          <GatewayBar name="SabPaisa" count={stats.sabPaisaCount} total={stats.totalPayments} color="bg-purple-500" />
          <GatewayBar name="PhonePe" count={stats.phonePeCount} total={stats.totalPayments} color="bg-indigo-500" />
          <GatewayBar name="AirPay" count={stats.airPayCount} total={stats.totalPayments} color="bg-cyan-500" />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
