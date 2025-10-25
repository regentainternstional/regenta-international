"use client";

import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    cashfreeCount: 0,
    razorpayCount: 0,
    successCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/payments`);
      const data = await res.json();
      const successfulPayments = data.filter((p) => p.status === "SUCCESS");
      const totalAmount = successfulPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const cashfreeCount = data.filter((p) => p.gateway === "cashfree").length;
      const razorpayCount = data.filter((p) => p.gateway === "razorpay").length;
      const successCount = successfulPayments.length;
      const pendingCount = data.filter(
        (p) => p.status === "PENDING" || p.status === "initiated"
      ).length;

      setStats({
        totalPayments: successCount, // Show only successful payments count
        totalAmount,
        cashfreeCount,
        razorpayCount,
        successCount,
        pendingCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon="📊"
          color="border-blue-500"
        />
        <StatCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toLocaleString()}`}
          icon="💰"
          color="border-green-500"
        />
        <StatCard
          title="Successful"
          value={stats.successCount}
          icon="✅"
          color="border-emerald-500"
        />
        <StatCard
          title="Cashfree Payments"
          value={stats.cashfreeCount}
          icon="💳"
          color="border-purple-500"
        />
        <StatCard
          title="Razorpay Payments"
          value={stats.razorpayCount}
          icon="💳"
          color="border-indigo-500"
        />
        <StatCard
          title="Pending"
          value={stats.pendingCount}
          icon="⏳"
          color="border-yellow-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Gateway Distribution
        </h3>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Cashfree</span>
              <span className="font-semibold">{stats.cashfreeCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.cashfreeCount / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Razorpay</span>
              <span className="font-semibold">{stats.razorpayCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.razorpayCount / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
