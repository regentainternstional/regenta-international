import mongoose from "mongoose";
const EmailLogSchema = new mongoose.Schema({
  txnId: { type: String, unique: true },
  sentAt: Date,
});

const EmailLog = mongoose.model("EmailLog", EmailLogSchema);

export default EmailLog;
