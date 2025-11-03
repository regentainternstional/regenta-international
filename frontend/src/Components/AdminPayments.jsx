

"use client";

import { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Search,
  Filter,
  X,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (payment) => {
    setDownloadingId(payment._id);

    try {
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice - ${payment.orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f5f5f5; }
            .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 30px; margin-bottom: 40px; }
            .header h1 { color: #1e40af; font-size: 32px; margin-bottom: 8px; }
            .header p { color: #64748b; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .info-section h3 { color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; font-weight: 600; }
            .info-item { margin-bottom: 12px; }
            .info-label { color: #64748b; font-size: 13px; margin-bottom: 4px; }
            .info-value { color: #1e293b; font-size: 15px; font-weight: 500; }
            .amount-section { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 40px; }
            .amount-section h3 { font-size: 16px; margin-bottom: 12px; opacity: 0.9; }
            .amount-section .amount { font-size: 42px; font-weight: 700; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .status-success { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-initiated { background: #dbeafe; color: #1e40af; }
            .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; color: #64748b; font-size: 13px; }
            .gateway-badge { display: inline-block; padding: 6px 12px; background: #f1f5f9; color: #475569; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>PAYMENT INVOICE</h1>
              <p>Invoice generated on ${new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
            </div>

            <div class="info-grid">
              <div class="info-section">
                <h3>Customer Details</h3>
                <div class="info-item">
                  <div class="info-label">Name</div>
                  <div class="info-value">${payment.customerName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${payment.customerEmail}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${payment.customerPhone}</div>
                </div>
              </div>

              <div class="info-section">
                <h3>Payment Details</h3>
                <div class="info-item">
                  <div class="info-label">Order ID</div>
                  <div class="info-value">${payment.orderId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Transaction Date</div>
                  <div class="info-value">${new Date(
                    payment.createdAt
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Payment Gateway</div>
                  <div class="gateway-badge">${payment.gateway.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div class="amount-section">
              <h3>Total Amount Paid</h3>
              <div class="amount">₹${payment.amount.toLocaleString(
                "en-IN"
              )}</div>
            </div>

            <div style="margin-bottom: 30px;">
              <strong style="color: #1e293b; font-size: 14px; margin-right: 12px;">Payment Status:</strong>
              <span class="status-badge status-${payment.status.toLowerCase()}">${
        payment.status
      }</span>
            </div>

            <div class="footer">
              <p><strong>Thank you for your payment!</strong></p>
              <p style="margin-top: 8px;">This is a computer-generated invoice and does not require a signature.</p>
              <p style="margin-top: 16px; font-size: 12px;">For any queries, please contact support.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([invoiceHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${payment.orderId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "airpay" && payment.gateway === "airpay") ||
      (filter === "sabpaisa" && payment.gateway === "sabpaisa") ||
      (filter === "phonepe" && payment.gateway === "phonepe") ||
      (filter === "success" && payment.status === "success") ||
      (filter === "initiated" && payment.status === "initiated");

    const matchesSearch =
      searchQuery === "" ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerPhone.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      initiated: "bg-blue-50 text-blue-700 border border-blue-200",
      failed: "bg-red-50 text-red-700 border border-red-200",
    };
    return (
      styles[status.toLowerCase()] ||
      "bg-slate-50 text-slate-700 border border-slate-200"
    );
  };

  const getGatewayColor = (gateway) => {
    const colors = {
      airpay: "bg-violet-50 text-violet-700 border border-violet-200",
      sabpaisa: "bg-cyan-50 text-cyan-700 border border-cyan-200",
      phonepe: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
    };
    return (
      colors[gateway.toLowerCase()] ||
      "bg-slate-50 text-slate-700 border border-slate-200"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 font-medium">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Payment Transactions
              </h1>
              <p className="text-sm text-slate-600">
                Manage and track all payment transactions
              </p>
            </div>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-auto text-sm font-medium"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading
                    ? "animate-spin"
                    : "group-hover:rotate-180 transition-transform duration-500"
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                    showFilters
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-blue-500"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>

              {showFilters && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    Filter by:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "all"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      All Payments
                    </button>

                    <div className="hidden sm:block w-px bg-slate-300"></div>

                    <button
                      onClick={() => setFilter("airpay")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "airpay"
                          ? "bg-violet-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Airpay
                    </button>
                    <button
                      onClick={() => setFilter("sabpaisa")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "sabpaisa"
                          ? "bg-cyan-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Sabpaisa
                    </button>
                    <button
                      onClick={() => setFilter("phonepe")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "phonepe"
                          ? "bg-fuchsia-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      PhonePe
                    </button>

                    <div className="hidden sm:block w-px bg-slate-300"></div>

                    <button
                      onClick={() => setFilter("success")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "success"
                          ? "bg-emerald-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Success
                    </button>
                    <button
                      onClick={() => setFilter("initiated")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        filter === "initiated"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Initiated
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                    Order Details
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden lg:table-cell whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden md:table-cell whitespace-nowrap">
                    Gateway
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden xl:table-cell whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-12 h-12 text-slate-300" />
                        <p className="text-base font-medium text-slate-600">
                          No payments found
                        </p>
                        <p className="text-sm text-slate-500">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-start gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 mb-1 text-sm truncate">
                              {payment.orderId}
                            </div>
                            <div className="lg:hidden space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {payment.customerName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {payment.customerEmail}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="font-medium text-slate-900 text-sm truncate">
                              {payment.customerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-xs text-slate-600 truncate">
                              {payment.customerEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-xs text-slate-600">
                              {payment.customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="font-bold text-base text-slate-900">
                          ₹{payment.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="md:hidden mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getGatewayColor(
                              payment.gateway
                            )}`}
                          >
                            {payment.gateway.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${getGatewayColor(
                            payment.gateway
                          )}`}
                        >
                          {payment.gateway.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${getStatusBadge(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden xl:table-cell">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-slate-600">
                            <div>
                              {new Date(payment.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(payment.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center">
                        <button
                          onClick={() => generateInvoice(payment)}
                          disabled={downloadingId === payment._id}
                          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium group text-xs"
                        >
                          <Download
                            className={`w-3.5 h-3.5 ${
                              downloadingId === payment._id
                                ? "animate-bounce"
                                : "group-hover:translate-y-0.5 transition-transform"
                            }`}
                          />
                          <span className="hidden sm:inline">
                            {downloadingId === payment._id
                              ? "Downloading..."
                              : "Invoice"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredPayments.length > 0 && (
            <div className="border-t border-slate-200 px-3 sm:px-4 py-3 bg-slate-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {filteredPayments.length}
                    </span>{" "}
                    payments
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                  >
                    <ChevronsLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-md"
                              : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                  >
                    <ChevronsRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
