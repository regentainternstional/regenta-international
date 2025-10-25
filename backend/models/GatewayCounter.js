import mongoose from "mongoose";

const gatewayCounterSchema = new mongoose.Schema({
  counter: { type: Number, default: 0 },
});

const GatewayCounter = mongoose.model("GatewayCounter", gatewayCounterSchema);
export default GatewayCounter;