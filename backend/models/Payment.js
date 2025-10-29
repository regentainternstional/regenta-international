// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   user: {
//     name: String,
//     email: String,
//     phone: String,
//   },
//   razorpay_order_id: String,
//   razorpay_payment_id: String,
//   razorpay_signature: String,
//   sabpaisa_txn_id:String,
//   amount: Number, // Optional: if you want to store the amount
//   status: {
//     type: String,
//     default: "success",
//   },
//   paymentGateway: { type: String, default: "sabpaisa" },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Payment", paymentSchema);

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  gateway: {
    type: String,
    enum: ["sabpaisa", "airpay"],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  status: { type: String, default: "initiated" },
  paymentSessionId: String,
  razorpayOrderId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
