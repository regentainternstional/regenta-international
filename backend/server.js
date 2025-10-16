import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { dbConnect } from "./helpers/dbConnect.js";
import Payment from "./models/Payment.js";
import UserData from "./models/UserData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_9999999999",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_key_here",
});

const encryptSabPaisa = (data) => {
  const key = Buffer.from(process.env.SABPAISA_AUTH_KEY, "utf8").slice(0, 16);
  const iv = Buffer.from(process.env.SABPAISA_AUTH_IV, "utf8").slice(0, 16);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

const decryptSabPaisa = (encryptedData) => {
  const key = Buffer.from(process.env.SABPAISA_AUTH_KEY, "utf8").slice(0, 16);
  const iv = Buffer.from(process.env.SABPAISA_AUTH_IV, "utf8").slice(0, 16);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Routes
app.get("/", (req, res) => {
  res.json({ message: "regent Backend Server is running!" });
});

// Create order
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
});

// Verify payment
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      amount,
      userDataId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment details",
      });
    }

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "your_secret_key_here"
      )
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.create({
        user, // expects { name, email, phone }
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        status: "success",
      });
      if (userDataId) {
        await UserData.findByIdAndUpdate(userDataId, { processed: true });
        console.log(`User data ${userDataId} marked as processed`);
      }
      console.log("Payment verified & saved to DB");

      res.json({
        success: true,
        message: "Payment verified and saved to database",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      error: "Payment verification failed",
      details: error.message,
    });
  }
});

app.post("/api/sabpaisa/create-payment", async (req, res) => {
  try {
    const { amount, name, email, phone, userDataId } = req.body

    if (!amount || !name || !email) {
      return res.status(400).json({ error: "Amount, name, and email are required" })
    }

    // Generate unique transaction ID
    const txnId = `TXN${Date.now()}`

    const payerPhone = phone || "9999999999"
    const payerAddress = "NA"
    const transData = new Date().toISOString()

    const dataString =
      `payerName=${name}&payerEmail=${email}&payerMobile=${payerPhone}` +
      `&clientTxnId=${txnId}&amount=${Number.parseFloat(amount).toFixed(2)}&clientCode=${process.env.SABPAISA_CLIENT_CODE}` +
      `&transUserName=${process.env.SABPAISA_USERNAME}&transUserPassword=${process.env.SABPAISA_PASSWORD}` +
      `&callbackUrl=${process.env.SABPAISA_CALLBACK_URL || `http://localhost:5000/api/sabpaisa/callback`}` +
      `&channelId=W&mcc=6012&transData=${transData}&udf1=${userDataId || ""}&udf2=`

    console.log("[v0] Payment data string before encryption:", dataString)
    console.log("[v0] Data string length:", dataString.length)

    // Encrypt the data
    const encData = encryptSabPaisa(dataString)

    console.log("[v0] Encrypted data:", encData)
    console.log("[v0] Encrypted data length:", encData.length)

    res.json({
      success: true,
      paymentUrl: process.env.SABPAISA_BASE_URL,
      encData,
      clientCode: process.env.SABPAISA_CLIENT_CODE,
      transactionId: txnId,
    })
  } catch (error) {
    console.error("[v0] Error creating SabPaisa payment:", error)
    res.status(500).json({
      error: "Failed to create payment",
      details: error.message,
    })
  }
})

app.post("/api/sabpaisa/callback", async (req, res) => {
  try {
    const { encData } = req.body

    if (!encData) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
    }

    // Decrypt the response
    const decryptedData = decryptSabPaisa(encData)
    console.log("[v0] Decrypted callback data:", decryptedData)

    // Parse query string format response
    const params = new URLSearchParams(decryptedData)
    const status = params.get("status")
    const transactionId = params.get("clientTxnId")
    const amount = params.get("amount")
    const payerName = params.get("payerName")
    const payerEmail = params.get("payerEmail")
    const payerMobile = params.get("payerMobile")
    const sabpaisaTxnId = params.get("sabpaisaTxnId")
    const bankTxnId = params.get("bankTxnId")
    const udf1 = params.get("udf1")

    console.log("[v0] Payment callback received:", {
      transactionId,
      status,
      amount,
      payerName,
      payerEmail,
    })

    // Check if payment was successful
    if (status === "SUCCESS") {
      // Save payment to database
      await Payment.create({
        user: {
          name: payerName,
          email: payerEmail,
          phone: payerMobile,
        },
        razorpay_order_id: transactionId,
        razorpay_payment_id: sabpaisaTxnId,
        razorpay_signature: bankTxnId,
        amount: Number.parseFloat(amount),
        status: "success",
        paymentGateway: "sabpaisa",
      })

      // Mark user data as processed if userDataId exists
      if (udf1) {
        await UserData.findByIdAndUpdate(udf1, { processed: true })
        console.log(`[v0] User data ${udf1} marked as processed`)
      }

      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`)
    } else {
      // Redirect to failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}`)
    }
  } catch (error) {
    console.error("[v0] Error processing SabPaisa callback:", error)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
  }
})

app.get("/api/sabpaisa/verify/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params

    const payment = await Payment.findOne({
      razorpay_order_id: transactionId,
    })

    if (!payment) {
      return res.json({ success: false, message: "Payment not found" })
    }

    res.json({
      success: true,
      payment: {
        status: payment.status,
        amount: payment.amount,
        user: payment.user,
      },
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({ error: "Failed to verify payment" })
  }
})

app.get("/api/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params
    const payment = await razorpay.payments.fetch(paymentId)

    res.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Error fetching payment:", error)
    res.status(500).json({
      error: "Failed to fetch payment details",
      details: error.message,
    })
  }
})

app.get("/api/user-data/next", async (req, res) => {
  try {
    const userData = await UserData.findOne({ processed: false }).sort({
      createdAt: 1,
    });

    if (!userData) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
