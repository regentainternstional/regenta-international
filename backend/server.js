// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import crypto from "crypto";
// import { dbConnect } from "./helpers/dbConnect.js";
// import Payment from "./models/Payment.js";
// import UploadedData from "./models/UserData.js";
// import GatewayCounter from "./models/GatewayCounter.js";
// import multer from "multer";
// import { parse } from "csv-parse/sync";
// import CRC32 from "crc-32";
// import axios from "axios";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "https://regentainternational.in",
//       "https://api.regentainternational.in",
//       process.env.FRONTEND_URL,
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only CSV files are allowed"));
//     }
//   },
// });

// const airpayUsername = process.env.AIRPAY_USERNAME;
// const airpayPassword = process.env.AIRPAY_PASSWORD;
// const airpaySecret = process.env.AIRPAY_API_KEY;
// const airpayMerchantId = process.env.AIRPAY_MERCHANT_ID;

// // Generate encryption key from username and password
// const airpayKey = crypto
//   .createHash("md5")
//   .update(airpayUsername + "~:~" + airpayPassword)
//   .digest("hex")
//   .substring(0, 32); // AES-256 requires 32 bytes

// function airpayEncrypt(data) {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(
//     "aes-256-cbc",
//     Buffer.from(airpayKey),
//     iv
//   );
//   let encrypted = cipher.update(data, "utf8", "base64");
//   encrypted += cipher.final("base64");
//   return iv.toString("hex") + encrypted;
// }

// function airpayDecrypt(encryptedData) {
//   try {
//     const iv = Buffer.from(encryptedData.substring(0, 32), "hex");
//     const encrypted = encryptedData.substring(32);
//     const decipher = crypto.createDecipheriv(
//       "aes-256-cbc",
//       Buffer.from(airpayKey),
//       iv
//     );
//     let decrypted = decipher.update(encrypted, "base64", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
//   } catch (error) {
//     console.error("[v0] Airpay decryption error:", error);
//     throw error;
//   }
// }

// function generateAirpayChecksum(data) {
//   const checksum = crypto
//     .createHash("sha256")
//     .update(airpaySecret + data)
//     .digest("hex");
//   return checksum;
// }

// function makeEnc(data) {
//   const key = crypto.createHash("sha256").update(data).digest("hex");
//   return key;
// }

// // Send POST request for token generation
// async function sendPostData(tokenUrl, postData) {
//   try {
//     const response = await axios.post(tokenUrl, new URLSearchParams(postData), {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("[v0] Error sending POST request:", error);
//     throw error;
//   }
// }

// async function getNextGateway() {
//   let counter = await GatewayCounter.findOne();

//   if (!counter) {
//     counter = await GatewayCounter.create({ counter: 0 });
//   }

//   const gateway = counter.counter % 2 === 0 ? "sabpaisa" : "airpay";

//   // Increment counter for next request
//   counter.counter += 1;
//   await counter.save();

//   return gateway;
// }

// app.post("/get-gateway", async (req, res) => {
//   try {
//     const gateway = await getNextGateway();
//     res.json({ gateway });
//   } catch (err) {
//     console.error("Error determining gateway:", err);
//     res.status(500).json({ error: "Failed to determine payment gateway" });
//   }
// });

// const encryptSabPaisa = (data) => {
//   // Decode base64 keys
//   const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64");
//   const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64");
//   // Generate random IV (12 bytes for GCM)
//   const iv = crypto.randomBytes(12);
//   // Create cipher with AES-256-GCM
//   const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
//   // Encrypt the data
//   let encrypted = cipher.update(data, "utf8");
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   // Get authentication tag (16 bytes)
//   const tag = cipher.getAuthTag();
//   // Concatenate: IV + encrypted + tag
//   const encryptedMessage = Buffer.concat([iv, encrypted, tag]);
//   // Generate HMAC-SHA384 of the encrypted message
//   const hmac = crypto.createHmac("sha384", hmacKey);
//   hmac.update(encryptedMessage);
//   const hmacDigest = hmac.digest();

//   // Final output: HMAC + encrypted message (as uppercase hex)
//   const result = Buffer.concat([hmacDigest, encryptedMessage]);
//   return result.toString("hex").toUpperCase();
// };

// const decryptSabPaisa = (encryptedData) => {
//   // Decode base64 keys
//   const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64");
//   const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64");

//   // Convert hex string to buffer
//   const encryptedBuffer = Buffer.from(encryptedData, "hex");

//   // Extract HMAC (first 48 bytes for SHA384)
//   const receivedHmac = encryptedBuffer.subarray(0, 48);
//   const encryptedMessage = encryptedBuffer.subarray(48);

//   // Verify HMAC
//   const hmac = crypto.createHmac("sha384", hmacKey);
//   hmac.update(encryptedMessage);
//   const calculatedHmac = hmac.digest();

//   // Timing-safe comparison
//   if (!crypto.timingSafeEqual(receivedHmac, calculatedHmac)) {
//     throw new Error("HMAC verification failed");
//   }

//   // Extract IV (12 bytes)
//   const iv = encryptedMessage.subarray(0, 12);
//   // Extract tag (last 16 bytes)
//   const tag = encryptedMessage.subarray(encryptedMessage.length - 16);
//   // Extract ciphertext (middle portion)
//   const ciphertext = encryptedMessage.subarray(
//     12,
//     encryptedMessage.length - 16
//   );

//   // Create decipher with AES-256-GCM
//   const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
//   decipher.setAuthTag(tag);

//   // Decrypt the data
//   let decrypted = decipher.update(ciphertext, undefined, "utf8");
//   decrypted += decipher.final("utf8");

//   return decrypted;
// };

// // Routes
// app.get("/", (req, res) => {
//   res.json({ message: "regent Backend Server is running!" });
// });

// app.post("/api/sabpaisa/create-payment", async (req, res) => {
//   try {
//     // const { amount, name, email, phone, userDataId } = req.body;
//     const { order_id, amount, name, phone, email } = req.body;

//     if (!amount || !name || !email) {
//       return res
//         .status(400)
//         .json({ error: "Amount, name, and email are required" });
//     }

//     // Generate unique transaction ID
//     const txnId = `TXN${Date.now()}`;

//     const payerPhone = phone || "9999999999";
//     const payerAddress = "NA";
//     const transData = new Date().toISOString();
//     const dataString =
//       `payerName=${name}&payerEmail=${email}&payerMobile=${payerPhone}` +
//       `&clientTxnId=${txnId}&amount=${Number.parseFloat(amount).toFixed(
//         2
//       )}&clientCode=${process.env.SABPAISA_CLIENT_CODE}` +
//       `&transUserName=${process.env.SABPAISA_USERNAME}&transUserPassword=${process.env.SABPAISA_PASSWORD}` +
//       `&callbackUrl=${
//         process.env.SABPAISA_CALLBACK_URL ||
//         `http://localhost:5000/api/sabpaisa/callback`
//       }` +
//       `&channelId=W&mcc=6012&transData=${transData}&udf1=${
//         order_id || ""
//       }&udf2=`;
//     // Encrypt the data
//     const encData = encryptSabPaisa(dataString);
//     await Payment.create({
//       orderId: order_id,
//       gateway: "sabpaisa",
//       amount: amount,
//       customerName: name,
//       customerEmail: email,
//       customerPhone: phone,
//       paymentSessionId: txnId,
//       status: "initiated",
//     });

//     res.json({
//       success: true,
//       paymentUrl: process.env.SABPAISA_BASE_URL,
//       encData,
//       clientCode: process.env.SABPAISA_CLIENT_CODE,
//       transactionId: txnId,
//     });
//   } catch (error) {
//     console.error("[v0] Error creating SabPaisa payment:", error);
//     res.status(500).json({
//       error: "Failed to create payment",
//       details: error.message,
//     });
//   }
// });

// app.post("/api/sabpaisa/callback", async (req, res) => {
//   try {
//     const { encData } = req.body;

//     if (!encData) {
//       return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
//     }

//     // Decrypt the response
//     const decryptedData = decryptSabPaisa(encData);

//     // Parse query string format response
//     const params = new URLSearchParams(decryptedData);
//     const status = params.get("status");
//     const transactionId = params.get("clientTxnId");
//     // const amount = params.get("amount");
//     // const payerName = params.get("payerName");
//     // const payerEmail = params.get("payerEmail");
//     // const payerMobile = params.get("payerMobile");
//     // const sabpaisaTxnId = params.get("sabpaisaTxnId");
//     // const bankTxnId = params.get("bankTxnId");
//     // const udf1 = params.get("udf1");

//     // Check if payment was successful
//     if (status === "SUCCESS") {
//       await Payment.findOneAndUpdate(
//         { razorpayOrderId: transactionId },
//         { status: "SUCCESS", updatedAt: Date.now() }
//       );

//       // Redirect to success page
//       res.redirect(
//         `${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`
//       );
//     } else {
//       // Redirect to failure page
//       res.redirect(
//         `${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}`
//       );
//     }
//   } catch (error) {
//     console.error("Error processing SabPaisa callback:", error);
//     res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
//   }
// });

// app.options("*", cors());

// app.post("/api/airpay/create-payment", async (req, res) => {
//   try {
//     console.log("[v0] Airpay payment request received:", {
//       order_id: req.body.order_id,
//       amount: req.body.amount,
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//     });
//     const { order_id, amount, name, phone, email } = req.body;

//     if (!amount || !name || !email || !phone) {
//       console.error("[v0] Missing required fields");
//       return res
//         .status(400)
//         .json({ error: "Amount, name, email, and phone are required" });
//     }

//     const orderid = order_id || `ORD${Date.now()}`;
//     const amountFormatted = Number.parseFloat(amount).toFixed(2);
//     console.log("[v0] Generated order ID:", orderid);

//     // Prepare payment data
//     const paymentData = {
//       buyer_email: email,
//       buyer_firstname: name,
//       buyer_lastname: "",
//       buyer_address: "NA",
//       buyer_city: "NA",
//       buyer_state: "NA",
//       buyer_country: "India",
//       buyer_phone: phone,
//       buyer_pincode: "000000",
//       amount: amountFormatted,
//       orderid: orderid,
//       iso_currency: "INR",
//       currency_code: "356",
//       merchant_id: airpayMerchantId,
//     };

//     console.log("[v0] Payment data prepared:", paymentData);

//     const privatekey = crypto
//       .createHash("sha256")
//       .update(airpaySecret + "@" + airpayUsername + ":|:" + airpayPassword)
//       .digest("hex");

//     console.log("[v0] Private key generated, length:", privatekey.length);

//     const sortedData = {};
//     Object.keys(paymentData)
//       .sort()
//       .forEach((key) => {
//         sortedData[key] = paymentData[key];
//       });

//     let checksumString = "";
//     for (const value of Object.values(sortedData)) {
//       checksumString += value;
//     }

//     const currentDate = new Date().toISOString().split("T")[0];
//     const checksum = crypto
//       .createHash("sha256")
//       .update(checksumString + currentDate)
//       .digest("hex");

//     console.log("[v0] Checksum generated:", checksum);

//     const encryptedData = airpayEncrypt(JSON.stringify(paymentData));
//     console.log("[v0] Data encrypted, length:", encryptedData.length);
//     // Store payment in database
//     await Payment.create({
//       orderId: orderid,
//       gateway: "airpay",
//       amount: amount,
//       customerName: name,
//       customerEmail: email,
//       customerPhone: phone,
//       paymentSessionId: orderid,
//       status: "initiated",
//     });

//     console.log("[v0] Payment record created in database");
//     const responseData = {
//       success: true,
//       paymentUrl:
//         process.env.AIRPAY_PAYMENT_URL ||
//         "https://payments.airpay.co.in/pay/index.php",
//       paymentData: {
//         mercid: airpayMerchantId,
//         data: encryptedData,
//         privatekey: privatekey,
//         checksum: checksum,
//       },
//     };

//     console.log(
//       "[v0] Sending response with payment URL:",
//       responseData.paymentUrl
//     );
//     res.json(responseData);
//   } catch (error) {
//     console.error("[v0] Error creating Airpay payment:", error);
//     console.error("[v0] Error stack:", error.stack);
//     res.status(500).json({
//       error: "Failed to create payment",
//       details: error.message,
//     });
//   }
// });

// app.post("/api/airpay/callback", async (req, res) => {
//   try {
//     const {
//       TRANSACTIONID,
//       APTRANSACTIONID,
//       AMOUNT,
//       TRANSACTIONSTATUS,
//       MESSAGE,
//       ap_SecureHash,
//       CUSTOMVAR,
//     } = req.body;

//     console.log("[v0] Airpay callback received:", req.body);

//     if (!TRANSACTIONID) {
//       return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
//     }

//     // Validate secure hash using CRC-32
//     const hashdata = `${TRANSACTIONID}:${APTRANSACTIONID}:${AMOUNT}:${TRANSACTIONSTATUS}:${
//       MESSAGE || ""
//     }:${airpayMerchantId}:${airpayUsername}`;
//     let calculatedHash = CRC32.str(hashdata);
//     calculatedHash = calculatedHash >>> 0; // Convert to unsigned

//     console.log(
//       "[v0] Calculated hash:",
//       calculatedHash,
//       "Received hash:",
//       ap_SecureHash
//     );

//     // Check if payment was successful (status code 200 means success in Airpay)
//     if (TRANSACTIONSTATUS === "200" || TRANSACTIONSTATUS === 200) {
//       await Payment.findOneAndUpdate(
//         { orderId: TRANSACTIONID },
//         {
//           status: "success",
//           updatedAt: Date.now(),
//           razorpayOrderId: APTRANSACTIONID,
//         }
//       );

//       // Mark uploaded data as processed if it exists
//       const payment = await Payment.findOne({ orderId: TRANSACTIONID });
//       if (payment && payment.customerEmail) {
//         await UploadedData.findOneAndUpdate(
//           { email: payment.customerEmail, processed: false },
//           { processed: true, processedAt: Date.now() }
//         );
//       }

//       res.redirect(
//         `${process.env.FRONTEND_URL}/payment/success?txnId=${TRANSACTIONID}`
//       );
//     } else {
//       await Payment.findOneAndUpdate(
//         { orderId: TRANSACTIONID },
//         { status: "failed", updatedAt: Date.now() }
//       );

//       res.redirect(
//         `${
//           process.env.FRONTEND_URL
//         }/payment/failed?txnId=${TRANSACTIONID}&message=${
//           MESSAGE || "Payment failed"
//         }`
//       );
//     }
//   } catch (error) {
//     console.error("[v0] Error processing Airpay callback:", error);
//     res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
//   }
// });

// // app.get("/api/sabpaisa/verify/:transactionId", async (req, res) => {
// //   try {
// //     const { transactionId } = req.params;

// //     const payment = await Payment.findOne({
// //       razorpay_order_id: transactionId,
// //     });

// //     if (!payment) {
// //       return res.json({ success: false, message: "Payment not found" });
// //     }

// //     res.json({
// //       success: true,
// //       payment: {
// //         status: payment.status,
// //         amount: payment.amount,
// //         user: payment.user,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error verifying payment:", error);
// //     res.status(500).json({ error: "Failed to verify payment" });
// //   }
// // });

// // app.get("/api/payment/:paymentId", async (req, res) => {
// //   try {
// //     const { paymentId } = req.params;
// //     const payment = await razorpay.payments.fetch(paymentId);

// //     res.json({
// //       success: true,
// //       payment,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching payment:", error);
// //     res.status(500).json({
// //       error: "Failed to fetch payment details",
// //       details: error.message,
// //     });
// //   }
// // });

// app.get("/payments", async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 });
//     res.json(payments);
//   } catch (err) {
//     console.error("Error fetching payments:", err);
//     res.status(500).json({ error: "Failed to fetch payments" });
//   }
// });

// // app.get("/api/user-data/next", async (req, res) => {
// //   try {
// //     const userData = await UserData.findOne({ processed: false }).sort({
// //       createdAt: 1,
// //     });

// //     if (!userData) {
// //       return res.json({ success: true, data: null });
// //     }

// //     res.json({ success: true, data: userData });
// //   } catch (error) {
// //     console.error("Error fetching user data:", error);
// //     res.status(500).json({ error: "Failed to fetch user data" });
// //   }
// // });

// app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const csvData = req.file.buffer.toString("utf-8");
//     const records = parse(csvData, {
//       columns: true,
//       skip_empty_lines: true,
//       trim: true,
//     });

//     const validRecords = [];
//     const errors = [];

//     records.forEach((record, index) => {
//       const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is header

//       if (!record.fullname || !record.fullname.trim()) {
//         errors.push(`Row ${rowNumber}: Full name is required`);
//         return;
//       }

//       if (!record.phone || !/^\d{10}$/.test(record.phone.trim())) {
//         errors.push(
//           `Row ${rowNumber}: Invalid phone number (must be 10 digits)`
//         );
//         return;
//       }

//       if (
//         !record.email ||
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.trim())
//       ) {
//         errors.push(`Row ${rowNumber}: Invalid email`);
//         return;
//       }

//       validRecords.push({
//         // amount: Number.parseFloat(record.amount),
//         fullname: record.fullname.trim(),
//         phone: record.phone.trim(),
//         email: record.email.trim(),
//         processed: false,
//       });
//     });

//     if (validRecords.length === 0) {
//       return res.status(400).json({
//         error: "No valid records found in CSV",
//         errors: errors,
//       });
//     }

//     // Insert all valid records
//     const insertedData = await UploadedData.insertMany(validRecords);

//     res.json({
//       success: true,
//       message: `Successfully uploaded ${insertedData.length} records`,
//       inserted: insertedData.length,
//       errors: errors.length > 0 ? errors : undefined,
//     });
//   } catch (err) {
//     console.error("Error uploading CSV:", err);
//     res.status(500).json({ error: "Failed to upload CSV file" });
//   }
// });

// app.get("/uploaded-data", async (req, res) => {
//   try {
//     const { filter } = req.query; // 'all', 'processed', 'unprocessed'

//     const query = {};
//     if (filter === "processed") {
//       query.processed = true;
//     } else if (filter === "unprocessed") {
//       query.processed = false;
//     }
//     const data = await UploadedData.find(query).sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     console.error("Error fetching uploaded data:", err);
//     res.status(500).json({ error: "Failed to fetch uploaded data" });
//   }
// });

// app.post("/verify-autofill-code", async (req, res) => {
//   const { code } = req.body;

//   try {
//     if (code !== process.env.AUTOFILL_CODE) {
//       return res.status(400).json({ success: false, message: "Invalid code" });
//     }

//     // Get the first unprocessed data
//     const unprocessedData = await UploadedData.findOne({
//       processed: false,
//     }).sort({ createdAt: 1 });

//     if (!unprocessedData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No unprocessed data available" });
//     }

//     res.json({
//       success: true,
//       data: {
//         id: unprocessedData._id,
//         // amount: unprocessedData.amount,
//         name: unprocessedData.fullname,
//         phone: unprocessedData.phone,
//         email: unprocessedData.email,
//       },
//     });
//   } catch (err) {
//     console.error("Error verifying code:", err);
//     res.status(500).json({ error: "Failed to verify code" });
//   }
// });

// app.post("/mark-data-processed", async (req, res) => {
//   const { dataId } = req.body;

//   try {
//     await UploadedData.findByIdAndUpdate(dataId, {
//       processed: true,
//       processedAt: Date.now(),
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Error marking data as processed:", err);
//     res.status(500).json({ error: "Failed to mark data as processed" });
//   }
// });

// app.delete("/uploaded-data/:id", async (req, res) => {
//   try {
//     await UploadedData.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Error deleting data:", err);
//     res.status(500).json({ error: "Failed to delete data" });
//   }
// });

// dbConnect().then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import crypto from "crypto"
import { dbConnect } from "./helpers/dbConnect.js"
import Payment from "./models/Payment.js"
import UploadedData from "./models/UserData.js"
import GatewayCounter from "./models/GatewayCounter.js"
import multer from "multer"
import { parse } from "csv-parse/sync"
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from "pg-sdk-node"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(
  cors({
    origin: ["https://regentainternational.in", "https://api.regentainternational.in", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true)
    } else {
      cb(new Error("Only CSV files are allowed"))
    }
  },
})

const phonePeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_CLIENT_ID,
  process.env.PHONEPE_CLIENT_SECRET,
  Number.parseInt(process.env.PHONEPE_CLIENT_VERSION),
  process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX,
)

console.log("[v0] PhonePe configuration loaded:")
console.log("[v0] - Client ID:", process.env.PHONEPE_CLIENT_ID)
console.log("[v0] - Environment:", process.env.PHONEPE_ENV)

// Airpay configuration logging
console.log("[v0] Airpay configuration loaded:")
console.log("[v0] - Merchant ID:", process.env.AIRPAY_MERCHANT_ID)
console.log("[v0] - Username:", process.env.AIRPAY_USERNAME)
console.log("[v0] - Client ID:", process.env.AIRPAY_CLIENT_ID)

const airpayEncrypt = (data, key) => {
  const iv = crypto.randomBytes(8)
  const ivHex = iv.toString("hex")
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "utf-8"), Buffer.from(ivHex))
  const raw = Buffer.concat([cipher.update(data, "utf-8"), cipher.final()])
  return ivHex + raw.toString("base64")
}

const airpayDecrypt = (encryptedData, key) => {
  const ivHex = encryptedData.substring(0, 16)
  const encryptedText = encryptedData.substring(16)
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "utf-8"), Buffer.from(ivHex))
  let decrypted = decipher.update(encryptedText, "base64", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

const encryptSabPaisa = (data) => {
  // Decode base64 keys
  const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64")
  const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64")
  // Generate random IV (12 bytes for GCM)
  const iv = crypto.randomBytes(12)
  // Create cipher with AES-256-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv)
  // Encrypt the data
  let encrypted = cipher.update(data, "utf8")
  encrypted = Buffer.concat([encrypted, cipher.final()])
  // Get authentication tag (16 bytes)
  const tag = cipher.getAuthTag()
  // Concatenate: IV + encrypted + tag
  const encryptedMessage = Buffer.concat([iv, encrypted, tag])
  // Generate HMAC-SHA384 of the encrypted message
  const hmac = crypto.createHmac("sha384", hmacKey)
  hmac.update(encryptedMessage)
  const hmacDigest = hmac.digest()

  // Final output: HMAC + encrypted message (as uppercase hex)
  const result = Buffer.concat([hmacDigest, encryptedMessage])
  return result.toString("hex").toUpperCase()
}

const decryptSabPaisa = (encryptedData) => {
  // Decode base64 keys
  const aesKey = Buffer.from(process.env.SABPAISA_AUTH_KEY, "base64")
  const hmacKey = Buffer.from(process.env.SABPAISA_AUTH_IV, "base64")

  // Convert hex string to buffer
  const encryptedBuffer = Buffer.from(encryptedData, "hex")

  // Extract HMAC (first 48 bytes for SHA384)
  const receivedHmac = encryptedBuffer.subarray(0, 48)
  const encryptedMessage = encryptedBuffer.subarray(48)

  // Verify HMAC
  const hmac = crypto.createHmac("sha384", hmacKey)
  hmac.update(encryptedMessage)
  const calculatedHmac = hmac.digest()

  // Timing-safe comparison
  if (!crypto.timingSafeEqual(receivedHmac, calculatedHmac)) {
    throw new Error("HMAC verification failed")
  }

  // Extract IV (12 bytes)
  const iv = encryptedMessage.subarray(0, 12)
  // Extract tag (last 16 bytes)
  const tag = encryptedMessage.subarray(encryptedMessage.length - 16)
  // Extract ciphertext (middle portion)
  const ciphertext = encryptedMessage.subarray(12, encryptedMessage.length - 16)

  // Create decipher with AES-256-GCM
  const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv)
  decipher.setAuthTag(tag)

  // Decrypt the data
  let decrypted = decipher.update(ciphertext, undefined, "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

async function getNextGateway() {
  let counter = await GatewayCounter.findOne()

  if (!counter) {
    counter = await GatewayCounter.create({ counter: 0 })
  }

  // Rotate through 3 gateways: sabpaisa (0), phonepe (1), airpay (2)
  const gateways = ["sabpaisa", "phonepe", "airpay"]
  const gateway = gateways[counter.counter % 3]

  counter.counter += 1
  await counter.save()

  return gateway
}

app.post("/get-gateway", async (req, res) => {
  try {
    const gateway = await getNextGateway()
    res.json({ gateway })
  } catch (err) {
    console.error("Error determining gateway:", err)
    res.status(500).json({ error: "Failed to determine payment gateway" })
  }
})

// Routes
app.get("/", (req, res) => {
  res.json({ message: "regent Backend Server is running!" })
})

app.post("/api/sabpaisa/create-payment", async (req, res) => {
  try {
    const { order_id, amount, name, phone, email } = req.body

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
      `&clientTxnId=${txnId}&amount=${Number.parseFloat(amount).toFixed(
        2,
      )}&clientCode=${process.env.SABPAISA_CLIENT_CODE}` +
      `&transUserName=${process.env.SABPAISA_USERNAME}&transUserPassword=${process.env.SABPAISA_PASSWORD}` +
      `&callbackUrl=${process.env.SABPAISA_CALLBACK_URL || `http://localhost:5000/api/sabpaisa/callback`}` +
      `&channelId=W&mcc=6012&transData=${transData}&udf1=${order_id || ""}&udf2=`
    // Encrypt the data
    const encData = encryptSabPaisa(dataString)
    await Payment.create({
      orderId: order_id,
      gateway: "sabpaisa",
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentSessionId: txnId,
      status: "initiated",
    })

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

    // Parse query string format response
    const params = new URLSearchParams(decryptedData)
    const status = params.get("status")
    const transactionId = params.get("clientTxnId")

    // Check if payment was successful
    if (status === "SUCCESS") {
      await Payment.findOneAndUpdate({ paymentSessionId: transactionId }, { status: "success", updatedAt: Date.now() })

      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`)
    } else {
      // Redirect to failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}`)
    }
  } catch (error) {
    console.error("Error processing SabPaisa callback:", error)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
  }
})

app.options("*", cors())

app.post("/api/phonepe/create-payment", async (req, res) => {
  try {
    console.log("[v0] ========== PHONEPE PAYMENT REQUEST ==========")
    console.log("[v0] Request body:", JSON.stringify(req.body, null, 2))

    const { order_id, amount, name, phone, email } = req.body

    if (!amount || !name || !email || !phone) {
      console.error("[v0] Missing required fields")
      return res.status(400).json({ error: "Amount, name, email, and phone are required" })
    }

    const merchantOrderId = order_id || `ORDER_${Date.now()}`
    const amountInPaisa = Math.round(Number.parseFloat(amount) * 100) // Convert to paisa

    console.log("[v0] Order ID:", merchantOrderId)
    console.log("[v0] Amount in paisa:", amountInPaisa)

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaisa)
      .redirectUrl(process.env.PHONEPE_REDIRECT_URL || `${process.env.FRONTEND_URL}/payment/status`)
      .build()

    console.log("[v0] Creating PhonePe payment...")

    const response = await phonePeClient.pay(request)

    console.log("[v0] PhonePe response:", response)

    const paymentUrl = response?.redirectUrl

    if (!paymentUrl) {
      console.error("[v0] No payment URL in response:", JSON.stringify(response, null, 2))
      throw new Error("Failed to get payment URL from PhonePe")
    }

    await Payment.create({
      orderId: merchantOrderId,
      gateway: "phonepe",
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentSessionId: merchantOrderId,
      status: "initiated",
    })

    console.log("[v0] Payment record created in database")
    console.log("[v0] Payment URL:", paymentUrl)
    console.log("[v0] ========== END PHONEPE REQUEST ==========")

    res.json({
      success: true,
      paymentUrl: paymentUrl,
      merchantOrderId: merchantOrderId,
    })
  } catch (error) {
    console.error("[v0] Error creating PhonePe payment:", error)
    console.error("[v0] Error stack:", error.stack)
    res.status(500).json({
      error: "Failed to create payment",
      details: error.message,
    })
  }
})

app.post("/api/phonepe/callback", async (req, res) => {
  try {
    console.log("[v0] PhonePe callback received:", req.body)

    const { merchantOrderId, transactionId, status } = req.body

    if (!merchantOrderId) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
    }

    // Check if payment was successful
    if (status === "SUCCESS" || status === "COMPLETED") {
      await Payment.findOneAndUpdate(
        { orderId: merchantOrderId },
        {
          status: "success",
          updatedAt: Date.now(),
          razorpayOrderId: transactionId,
        },
      )

      // Mark uploaded data as processed if it exists
      const payment = await Payment.findOne({ orderId: merchantOrderId })
      if (payment && payment.customerEmail) {
        await UploadedData.findOneAndUpdate(
          { email: payment.customerEmail, processed: false },
          { processed: true, processedAt: Date.now() },
        )
      }

      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${merchantOrderId}`)
    } else {
      await Payment.findOneAndUpdate({ orderId: merchantOrderId }, { status: "failed", updatedAt: Date.now() })

      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${merchantOrderId}`)
    }
  } catch (error) {
    console.error("[v0] Error processing PhonePe callback:", error)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
  }
})

app.get("/api/phonepe/status/:merchantOrderId", async (req, res) => {
  try {
    const { merchantOrderId } = req.params

    console.log("[v0] Checking PhonePe payment status for:", merchantOrderId)

    // Check status from database
    const payment = await Payment.findOne({ orderId: merchantOrderId })

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    res.json({
      success: true,
      status: payment.status,
      amount: payment.amount,
      orderId: payment.orderId,
    })
  } catch (error) {
    console.error("[v0] Error checking PhonePe status:", error)
    res.status(500).json({
      error: "Failed to check payment status",
      details: error.message,
    })
  }
})

app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    console.error("Error fetching payments:", err)
    res.status(500).json({ error: "Failed to fetch payments" })
  }
})

app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const csvData = req.file.buffer.toString("utf-8")
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const validRecords = []
    const errors = []

    records.forEach((record, index) => {
      const rowNumber = index + 2

      if (!record.fullname || !record.fullname.trim()) {
        errors.push(`Row ${rowNumber}: Full name is required`)
        return
      }

      if (!record.phone || !/^\d{10}$/.test(record.phone.trim())) {
        errors.push(`Row ${rowNumber}: Invalid phone number (must be 10 digits)`)
        return
      }

      if (!record.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.trim())) {
        errors.push(`Row ${rowNumber}: Invalid email`)
        return
      }

      validRecords.push({
        fullname: record.fullname.trim(),
        phone: record.phone.trim(),
        email: record.email.trim(),
        processed: false,
      })
    })

    if (validRecords.length === 0) {
      return res.status(400).json({
        error: "No valid records found in CSV",
        errors: errors,
      })
    }

    const insertedData = await UploadedData.insertMany(validRecords)

    res.json({
      success: true,
      message: `Successfully uploaded ${insertedData.length} records`,
      inserted: insertedData.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error("Error uploading CSV:", err)
    res.status(500).json({ error: "Failed to upload CSV file" })
  }
})

app.get("/uploaded-data", async (req, res) => {
  try {
    const { filter } = req.query

    const query = {}
    if (filter === "processed") {
      query.processed = true
    } else if (filter === "unprocessed") {
      query.processed = false
    }
    const data = await UploadedData.find(query).sort({ createdAt: -1 })
    res.json(data)
  } catch (err) {
    console.error("Error fetching uploaded data:", err)
    res.status(500).json({ error: "Failed to fetch uploaded data" })
  }
})

app.post("/verify-autofill-code", async (req, res) => {
  const { code } = req.body

  try {
    if (code !== process.env.AUTOFILL_CODE) {
      return res.status(400).json({ success: false, message: "Invalid code" })
    }

    const unprocessedData = await UploadedData.findOne({
      processed: false,
    }).sort({ createdAt: 1 })

    if (!unprocessedData) {
      return res.status(404).json({ success: false, message: "No unprocessed data available" })
    }

    res.json({
      success: true,
      data: {
        id: unprocessedData._id,
        name: unprocessedData.fullname,
        phone: unprocessedData.phone,
        email: unprocessedData.email,
      },
    })
  } catch (err) {
    console.error("Error verifying code:", err)
    res.status(500).json({ error: "Failed to verify code" })
  }
})

app.post("/mark-data-processed", async (req, res) => {
  const { dataId } = req.body

  try {
    await UploadedData.findByIdAndUpdate(dataId, {
      processed: true,
      processedAt: Date.now(),
    })

    res.json({ success: true })
  } catch (err) {
    console.error("Error marking data as processed:", err)
    res.status(500).json({ error: "Failed to mark data as processed" })
  }
})

app.delete("/uploaded-data/:id", async (req, res) => {
  try {
    await UploadedData.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error("Error deleting data:", err)
    res.status(500).json({ error: "Failed to delete data" })
  }
})

app.post("/api/airpay/create-payment", async (req, res) => {
  try {
    console.log("[v0] ========== AIRPAY PAYMENT REQUEST ==========")
    console.log("[v0] Request body:", JSON.stringify(req.body, null, 2))

    const { order_id, amount, name, phone, email } = req.body

    if (!amount || !name || !email || !phone) {
      console.error("[v0] Missing required fields")
      return res.status(400).json({ error: "Amount, name, email, and phone are required" })
    }

    const airpayMerchantId = process.env.AIRPAY_MERCHANT_ID
    const airpayUsername = process.env.AIRPAY_USERNAME
    const airpayPassword = process.env.AIRPAY_PASSWORD
    const airpaySecret = process.env.AIRPAY_SECRET

    const airpayKey = crypto
      .createHash("md5")
      .update(airpayUsername + "~:~" + airpayPassword)
      .digest("hex")

    const orderId = order_id || `ORDER_${Date.now()}`
    const amountFormatted = Number.parseFloat(amount).toFixed(2)

    const dataObject = {
      buyer_email: email,
      buyer_firstname: name,
      buyer_lastname: "",
      buyer_address: "NA",
      buyer_city: "NA",
      buyer_state: "NA",
      buyer_country: "India",
      amount: amountFormatted,
      orderid: orderId,
      buyer_phone: phone,
      buyer_pincode: "000000",
      iso_currency: "INR",
      currency_code: "356",
      merchant_id: airpayMerchantId,
    }

    const dataString = JSON.stringify(dataObject)
    const encryptedData = airpayEncrypt(dataString, airpayKey)

    const udata = airpayUsername + ":|:" + airpayPassword
    const privatekey = crypto
      .createHash("sha256")
      .update(airpaySecret + "@" + udata)
      .digest("hex")

    const currentDate = new Date().toISOString().split("T")[0]
    const checksumData = Object.values(dataObject).sort().join("") + currentDate
    const checksum = crypto
      .createHash("sha256")
      .update(airpaySecret + "@" + checksumData)
      .digest("hex")

    const paymentUrl = process.env.AIRPAY_PAYMENT_URL || "https://payments.airpay.co.in/pay/index.php"

    await Payment.create({
      orderId: orderId,
      gateway: "airpay",
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentSessionId: orderId,
      status: "initiated",
    })

    console.log("[v0] Payment record created in database")
    console.log("[v0] Payment URL:", paymentUrl)
    console.log("[v0] Encrypted data length:", encryptedData.length)
    console.log("[v0] ========== END AIRPAY REQUEST ==========")

    res.json({
      success: true,
      paymentUrl: paymentUrl,
      paymentData: {
        mercid: airpayMerchantId,
        data: encryptedData,
        privatekey: privatekey,
        checksum: checksum,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating Airpay payment:", error)
    console.error("[v0] Error stack:", error.stack)
    res.status(500).json({
      error: "Failed to create payment",
      details: error.message,
    })
  }
})

app.post("/api/airpay/callback", async (req, res) => {
  try {
    console.log("[v0] Airpay callback received:", req.body)

    const { TRANSACTIONID, APTRANSACTIONID, AMOUNT, TRANSACTIONSTATUS } = req.body

    if (!TRANSACTIONID) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
    }

    if (TRANSACTIONSTATUS === "200") {
      await Payment.findOneAndUpdate(
        { orderId: TRANSACTIONID },
        {
          status: "success",
          updatedAt: Date.now(),
          razorpayOrderId: APTRANSACTIONID,
        },
      )

      const payment = await Payment.findOne({ orderId: TRANSACTIONID })
      if (payment && payment.customerEmail) {
        await UploadedData.findOneAndUpdate(
          { email: payment.customerEmail, processed: false },
          { processed: true, processedAt: Date.now() },
        )
      }

      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${TRANSACTIONID}`)
    } else {
      await Payment.findOneAndUpdate({ orderId: TRANSACTIONID }, { status: "failed", updatedAt: Date.now() })

      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${TRANSACTIONID}`)
    }
  } catch (error) {
    console.error("[v0] Error processing Airpay callback:", error)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`)
  }
})

dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
