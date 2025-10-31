"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { XCircle } from "lucide-react"

export default function PaymentFailed() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [transactionDetails, setTransactionDetails] = useState(null)

  const txnId = searchParams.get("txnId")
  const orderId = searchParams.get("orderId")
  const error = searchParams.get("error")

  useEffect(() => {
    // Fetch transaction details if txnId is available
    if (txnId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/payment/status/${txnId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTransactionDetails(data.payment)
          }
        })
        .catch((error) => {
          console.error("Error fetching transaction details:", error)
        })
    }
  }, [txnId])

  const getErrorMessage = () => {
    if (error === "invalid_hash") {
      return "Payment verification failed. Please contact support."
    }
    if (transactionDetails?.status === "failed") {
      return transactionDetails.message || "Payment was declined by the payment gateway."
    }
    return "Your payment could not be processed. Please try again."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>

          <p className="text-gray-600 mb-6">{getErrorMessage()}</p>

          {transactionDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-3">Transaction Details</h2>
              <div className="space-y-2 text-sm">
                {transactionDetails.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-900">{transactionDetails.transaction_id}</span>
                  </div>
                )}
                {transactionDetails.order_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-900">{transactionDetails.order_id}</span>
                  </div>
                )}
                {transactionDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">
                      ₹{Number.parseFloat(transactionDetails.amount).toFixed(2)}
                    </span>
                  </div>
                )}
                {transactionDetails.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 capitalize">{transactionDetails.payment_method}</span>
                  </div>
                )}
                {transactionDetails.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(transactionDetails.created_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!transactionDetails && (txnId || orderId) && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-3">Transaction Details</h2>
              <div className="space-y-2 text-sm">
                {txnId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-900">{txnId}</span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-900">{orderId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">Need help? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  )
}
