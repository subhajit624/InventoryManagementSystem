import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  currency: String,
  status: { type: String, default: "created" }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
