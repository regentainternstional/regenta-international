"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const PaymentStatus = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    // Get all parameters from URL
    const transactionId = searchParams.get("TRANSACTIONID") || searchParams.get("txnId")
    const aptransactionId = searchParams.get("APTRANSACTIONID")
    const amount = searchParams.get("AMOUNT")
    const transactionStatus = searchParams.get("TRANSACTIONSTATUS")
    const message = searchParams.get("MESSAGE")
    const customvar = searchParams.get("CUSTOMVAR")

    // Check if this is an Airpay response
    if (transactionId && transactionStatus) {
      setPaymentDetails({
        orderId: transactionId,
        airpayTxnId: aptransactionId,
        amount: amount,
        status: transactionStatus,
        message: message,
        customvar: customvar,
      })

      // Determine success or failure based on status code
      // Airpay returns 200 for successful payments
      if (transactionStatus === "200") {
        setStatus("success")
      } else {
        setStatus("failed")
      }
    } else {
      // No payment parameters found
      setStatus("error")
    }
  }, [searchParams])

  const handleGoHome = () => {
    navigate("/")
  }

  const handleViewPayments = () => {
    navigate("/admin/payments")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Processing Payment...</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your payment</p>
        </div>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully</p>

            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-800">{paymentDetails.orderId}</span>
                  </div>
                  {paymentDetails.airpayTxnId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-semibold text-gray-800">{paymentDetails.airpayTxnId}</span>
                    </div>
                  )}
                  {paymentDetails.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-800">₹{paymentDetails.amount}</span>
                    </div>
                  )}
                  {paymentDetails.message && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Message:</span>
                      <span className="font-semibold text-gray-800">{paymentDetails.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={handleViewPayments}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                View All Payments
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">Unfortunately, your payment could not be processed</p>

            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-800">{paymentDetails.orderId}</span>
                  </div>
                  {paymentDetails.message && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-semibold text-red-600">{paymentDetails.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Invalid Payment Response</h2>
        <p className="text-gray-600 mb-6">No payment information found</p>
        <button
          onClick={handleGoHome}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default PaymentStatus
