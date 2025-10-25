// import mongoose from "mongoose"

// const userDataSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true,
//   },
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   processed: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// export default mongoose.model("UserData", userDataSchema)

import mongoose from "mongoose";
const uploadedDataSchema = new mongoose.Schema({
  // amount: { type: Number, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

const UploadedData = mongoose.model("UploadedData", uploadedDataSchema);
export default UploadedData;
