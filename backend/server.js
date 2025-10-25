import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { dbConnect } from "./helpers/dbConnect.js";
import Payment from "./models/Payment.js";
import UploadedData from "./models/UserData.js";
import GatewayCounter from "./models/GatewayCounter.js";
import multer from "multer";
import { parse } from "csv-parse/sync";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(
  cors({
    origin: [
      "https://regentainternational.in",
      "https://api.regentainternational.in",
      process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_9999999999",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_key_here",
// });

async function getNextGateway() {
  let counter = await GatewayCounter.findOne();

  if (!counter) {
    counter = await GatewayCounter.create({ counter: 0 });
  }

  // const gateway = counter.counter % 2 === 0 ? "cashfree" : "razorpay";
  const gateway = counter.counter % 2 === 0 ? "sabpaisa" : "sabpaisa";

  // Increment counter for next request
  counter.counter += 1;
  await counter.save();

  return gateway;
}

app.post("/get-gateway", async (req, res) => {
  try {
    const gateway = await getNextGateway();
    res.json({ gateway });
  } catch (err) {
    console.error("Error determining gateway:", err);
    res.status(500).json({ error: "Failed to determine payment gateway" });
  }
});

const encryptSabPaisa = (data) => {
  // Decode base64 keys
  const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64");
  const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64");
  // Generate random IV (12 bytes for GCM)
  const iv = crypto.randomBytes(12);
  // Create cipher with AES-256-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
  // Encrypt the data
  let encrypted = cipher.update(data, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Get authentication tag (16 bytes)
  const tag = cipher.getAuthTag();
  // Concatenate: IV + encrypted + tag
  const encryptedMessage = Buffer.concat([iv, encrypted, tag]);
  // Generate HMAC-SHA384 of the encrypted message
  const hmac = crypto.createHmac("sha384", hmacKey);
  hmac.update(encryptedMessage);
  const hmacDigest = hmac.digest();

  // Final output: HMAC + encrypted message (as uppercase hex)
  const result = Buffer.concat([hmacDigest, encryptedMessage]);
  return result.toString("hex").toUpperCase();
};

const decryptSabPaisa = (encryptedData) => {
  // Decode base64 keys
  const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64");
  const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64");

  // Convert hex string to buffer
  const encryptedBuffer = Buffer.from(encryptedData, "hex");

  // Extract HMAC (first 48 bytes for SHA384)
  const receivedHmac = encryptedBuffer.subarray(0, 48);
  const encryptedMessage = encryptedBuffer.subarray(48);

  // Verify HMAC
  const hmac = crypto.createHmac("sha384", hmacKey);
  hmac.update(encryptedMessage);
  const calculatedHmac = hmac.digest();

  // Timing-safe comparison
  if (!crypto.timingSafeEqual(receivedHmac, calculatedHmac)) {
    throw new Error("HMAC verification failed");
  }

  // Extract IV (12 bytes)
  const iv = encryptedMessage.subarray(0, 12);
  // Extract tag (last 16 bytes)
  const tag = encryptedMessage.subarray(encryptedMessage.length - 16);
  // Extract ciphertext (middle portion)
  const ciphertext = encryptedMessage.subarray(
    12,
    encryptedMessage.length - 16
  );

  // Create decipher with AES-256-GCM
  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
  decipher.setAuthTag(tag);

  // Decrypt the data
  let decrypted = decipher.update(ciphertext, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

// Routes
app.get("/", (req, res) => {
  res.json({ message: "regent Backend Server is running!" });
});

// Create order
// app.post("/api/create-order", async (req, res) => {
//   try {
//     const { amount, currency = "INR" } = req.body;

//     if (!amount) {
//       return res.status(400).json({ error: "Amount is required" });
//     }

//     const options = {
//       amount: Math.round(amount * 100), // Convert to paise
//       currency,
//       receipt: `receipt_${Date.now()}`,
//       payment_capture: 1,
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       order: {
//         id: order.id,
//         amount: order.amount,
//         currency: order.currency,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       error: "Failed to create order",
//       details: error.message,
//     });
//   }
// });

// Verify payment
// app.post("/api/verify-payment", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       user,
//       amount,
//       userDataId,
//     } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         error: "Missing required payment details",
//       });
//     }

//     // Create signature for verification
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac(
//         "sha256",
//         process.env.RAZORPAY_KEY_SECRET || "your_secret_key_here"
//       )
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (isAuthentic) {
//       await Payment.create({
//         user, // expects { name, email, phone }
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         amount,
//         status: "success",
//       });
//       if (userDataId) {
//         await UserData.findByIdAndUpdate(userDataId, { processed: true });
//       }

//       res.json({
//         success: true,
//         message: "Payment verified and saved to database",
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         error: "Payment verification failed",
//         details: error.message,
//       });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({
//       success: false,
//       error: "Payment verification failed",
//       details: error.message,
//     });
//   }
// });

app.post("/api/sabpaisa/create-payment", async (req, res) => {
  try {
    // const { amount, name, email, phone, userDataId } = req.body;
    const { order_id, amount, name, phone, email } = req.body;

    if (!amount || !name || !email) {
      return res
        .status(400)
        .json({ error: "Amount, name, and email are required" });
    }

    // Generate unique transaction ID
    const txnId = `TXN${Date.now()}`;

    const payerPhone = phone || "9999999999";
    const payerAddress = "NA";
    const transData = new Date().toISOString();
    const dataString =
      `payerName=${name}&payerEmail=${email}&payerMobile=${payerPhone}` +
      `&clientTxnId=${txnId}&amount=${Number.parseFloat(amount).toFixed(
        2
      )}&clientCode=${process.env.SABPAISA_CLIENT_CODE}` +
      `&transUserName=${process.env.SABPAISA_USERNAME}&transUserPassword=${process.env.SABPAISA_PASSWORD}` +
      `&callbackUrl=${
        process.env.SABPAISA_CALLBACK_URL ||
        `http://localhost:5000/api/sabpaisa/callback`
      }` +
      `&channelId=W&mcc=6012&transData=${transData}&udf1=${
        order_id || ""
      }&udf2=`;
    // Encrypt the data
    const encData = encryptSabPaisa(dataString);
    await Payment.create({
      orderId: order_id,
      gateway: "sabpaisa",
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentSessionId: txnId,
      status: "initiated",
    });

    res.json({
      success: true,
      paymentUrl: process.env.SABPAISA_BASE_URL,
      encData,
      clientCode: process.env.SABPAISA_CLIENT_CODE,
      transactionId: txnId,
    });
  } catch (error) {
    console.error("[v0] Error creating SabPaisa payment:", error);
    res.status(500).json({
      error: "Failed to create payment",
      details: error.message,
    });
  }
});

app.post("/api/sabpaisa/callback", async (req, res) => {
  try {
    const { encData } = req.body;

    if (!encData) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }

    // Decrypt the response
    const decryptedData = decryptSabPaisa(encData);

    // Parse query string format response
    const params = new URLSearchParams(decryptedData);
    const status = params.get("status");
    const transactionId = params.get("clientTxnId");
    // const amount = params.get("amount");
    // const payerName = params.get("payerName");
    // const payerEmail = params.get("payerEmail");
    // const payerMobile = params.get("payerMobile");
    // const sabpaisaTxnId = params.get("sabpaisaTxnId");
    // const bankTxnId = params.get("bankTxnId");
    // const udf1 = params.get("udf1");

    // Check if payment was successful
    if (status === "SUCCESS") {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: transactionId },
        { status: "SUCCESS", updatedAt: Date.now() }
      );

      // Redirect to success page
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`
      );
    } else {
      // Redirect to failure page
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}`
      );
    }
  } catch (error) {
    console.error("Error processing SabPaisa callback:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
});

// app.get("/api/sabpaisa/verify/:transactionId", async (req, res) => {
//   try {
//     const { transactionId } = req.params;

//     const payment = await Payment.findOne({
//       razorpay_order_id: transactionId,
//     });

//     if (!payment) {
//       return res.json({ success: false, message: "Payment not found" });
//     }

//     res.json({
//       success: true,
//       payment: {
//         status: payment.status,
//         amount: payment.amount,
//         user: payment.user,
//       },
//     });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "Failed to verify payment" });
//   }
// });

// app.get("/api/payment/:paymentId", async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await razorpay.payments.fetch(paymentId);

//     res.json({
//       success: true,
//       payment,
//     });
//   } catch (error) {
//     console.error("Error fetching payment:", error);
//     res.status(500).json({
//       error: "Failed to fetch payment details",
//       details: error.message,
//     });
//   }
// });

app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// app.get("/api/user-data/next", async (req, res) => {
//   try {
//     const userData = await UserData.findOne({ processed: false }).sort({
//       createdAt: 1,
//     });

//     if (!userData) {
//       return res.json({ success: true, data: null });
//     }

//     res.json({ success: true, data: userData });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ error: "Failed to fetch user data" });
//   }
// });

app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvData = req.file.buffer.toString("utf-8");
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const validRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is header

      if (!record.fullname || !record.fullname.trim()) {
        errors.push(`Row ${rowNumber}: Full name is required`);
        return;
      }

      if (!record.phone || !/^\d{10}$/.test(record.phone.trim())) {
        errors.push(
          `Row ${rowNumber}: Invalid phone number (must be 10 digits)`
        );
        return;
      }

      if (
        !record.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.trim())
      ) {
        errors.push(`Row ${rowNumber}: Invalid email`);
        return;
      }

      validRecords.push({
        // amount: Number.parseFloat(record.amount),
        fullname: record.fullname.trim(),
        phone: record.phone.trim(),
        email: record.email.trim(),
        processed: false,
      });
    });

    if (validRecords.length === 0) {
      return res.status(400).json({
        error: "No valid records found in CSV",
        errors: errors,
      });
    }

    // Insert all valid records
    const insertedData = await UploadedData.insertMany(validRecords);

    res.json({
      success: true,
      message: `Successfully uploaded ${insertedData.length} records`,
      inserted: insertedData.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Error uploading CSV:", err);
    res.status(500).json({ error: "Failed to upload CSV file" });
  }
});

app.get("/uploaded-data", async (req, res) => {
  try {
    const { filter } = req.query; // 'all', 'processed', 'unprocessed'

    const query = {};
    if (filter === "processed") {
      query.processed = true;
    } else if (filter === "unprocessed") {
      query.processed = false;
    }
    const data = await UploadedData.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching uploaded data:", err);
    res.status(500).json({ error: "Failed to fetch uploaded data" });
  }
});

app.post("/verify-autofill-code", async (req, res) => {
  const { code } = req.body;

  try {
    if (code !== process.env.AUTOFILL_CODE) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // Get the first unprocessed data
    const unprocessedData = await UploadedData.findOne({
      processed: false,
    }).sort({ createdAt: 1 });

    if (!unprocessedData) {
      return res
        .status(404)
        .json({ success: false, message: "No unprocessed data available" });
    }

    res.json({
      success: true,
      data: {
        id: unprocessedData._id,
        // amount: unprocessedData.amount,
        name: unprocessedData.fullname,
        phone: unprocessedData.phone,
        email: unprocessedData.email,
      },
    });
  } catch (err) {
    console.error("Error verifying code:", err);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

app.post("/mark-data-processed", async (req, res) => {
  const { dataId } = req.body;

  try {
    await UploadedData.findByIdAndUpdate(dataId, {
      processed: true,
      processedAt: Date.now(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking data as processed:", err);
    res.status(500).json({ error: "Failed to mark data as processed" });
  }
});

app.delete("/uploaded-data/:id", async (req, res) => {
  try {
    await UploadedData.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
