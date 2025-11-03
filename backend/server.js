
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
import CRC32 from "crc-32"
import dateformat from "dateformat"

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


const airpayEncrypt = (data, key, ivHex) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "utf-8"), Buffer.from(ivHex))
  const raw = Buffer.concat([cipher.update(data, "utf-8"), cipher.final()])
  return ivHex + raw.toString("base64")
}

const airpayDecrypt = (encryptedData, key) => {
  try {
    const hash = crypto.createHash("sha256").update(encryptedData).digest()
    const iv = hash.slice(0, 16)
    const encryptedText = Buffer.from(encryptedData.slice(16), "base64")
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "utf-8"), iv)
    let decrypted = decipher.update(encryptedText, "binary", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    console.error("[v0] Airpay decryption error:", error)
    throw error
  }
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
      `&callbackUrl=${process.env.SABPAISA_CALLBACK_URL || `https://api.regentainternational.in/api/sabpaisa/callback`}` +
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
    const encData = req.body.encData || req.body.encResponse

    if (!encData) {
      console.error("[v0] ❌ CRITICAL ERROR: No encData in POST request")
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=missing_data`)
    }

    let decryptedData
    try {
      decryptedData = decryptSabPaisa(encData)
    } catch (decryptError) {
      console.error("[v0] Decryption failed:", decryptError)
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=decryption_failed`)
    }

    // Parse query string format response
    const params = new URLSearchParams(decryptedData)
    const status = params.get("status")
    const transactionId = params.get("clientTxnId")

    if (status && status.toUpperCase() === "SUCCESS") {
      await Payment.findOneAndUpdate({ paymentSessionId: transactionId }, { status: "success", updatedAt: Date.now() })

      const payment = await Payment.findOne({ paymentSessionId: transactionId })
      if (payment && payment.customerEmail) {
        await UploadedData.findOneAndUpdate(
          { email: payment.customerEmail, processed: false },
          { processed: true, processedAt: Date.now() },
        )
      }
      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`)
    } else {
      console.log("[v0] Payment failed, redirecting to failed page")
      console.log("[v0] ========== END SABPAISA CALLBACK ==========")
      await Payment.findOneAndUpdate({ paymentSessionId: transactionId }, { status: "failed", updatedAt: Date.now() })
      // Redirect to failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}&status=${status}`)
    }
  } catch (error) {
    console.error("[v0] Error processing SabPaisa POST callback:", error)
    console.error("[v0] Error stack:", error.stack)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=processing_error`)
  }
})

app.get("/api/sabpaisa/callback", async (req, res) => {
  try {
    const encData = req.query.encData || req.query.encResponse

    if (!encData) {
      console.error("[v0] ❌ CRITICAL ERROR: No encData or encResponse in GET request")
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=missing_data`)
    }

    let decryptedData
    try {
      decryptedData = decryptSabPaisa(encData)
    } catch (decryptError) {
      console.error("[v0] Decryption failed:", decryptError)
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=decryption_failed`)
    }

    // Parse query string format response
    const params = new URLSearchParams(decryptedData)
    const status = params.get("status")
    const transactionId = params.get("clientTxnId")

    if (status && status.toUpperCase() === "SUCCESS") {
      await Payment.findOneAndUpdate({ paymentSessionId: transactionId }, { status: "success", updatedAt: Date.now() })

      const payment = await Payment.findOne({ paymentSessionId: transactionId })
      if (payment && payment.customerEmail) {
        await UploadedData.findOneAndUpdate(
          { email: payment.customerEmail, processed: false },
          { processed: true, processedAt: Date.now() },
        )
      }

      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${transactionId}`)
    } else {
      console.log("[v0] Payment failed, redirecting to failed page")
      console.log("[v0] ========== END SABPAISA CALLBACK ==========")
      await Payment.findOneAndUpdate({ paymentSessionId: transactionId }, { status: "failed", updatedAt: Date.now() })
      // Redirect to failure page
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?txnId=${transactionId}&status=${status}`)
    }
  } catch (error) {
    console.error("[v0] Error processing SabPaisa GET callback:", error)
    console.error("[v0] Error stack:", error.stack)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=processing_error`)
  }
})

app.post("/api/phonepe/create-payment", async (req, res) => {
  try {
    console.log("[v0] Request body:", JSON.stringify(req.body, null, 2))

    const { order_id, amount, name, phone, email } = req.body

    if (!amount || !name || !email || !phone) {
      console.error("[v0] Missing required fields")
      return res.status(400).json({ error: "Amount, name, email, and phone are required" })
    }

    const merchantOrderId = order_id || `ORDER_${Date.now()}`
    const amountInPaisa = Math.round(Number.parseFloat(amount) * 100) // Convert to paisa


    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaisa)
      .redirectUrl(process.env.PHONEPE_REDIRECT_URL || `${process.env.FRONTEND_URL}/payment/status`)
      .build()


    const response = await phonePeClient.pay(request)


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
    const { order_id, amount, name, phone, email } = req.body

    if (!amount || !name || !email || !phone) {
      console.error("[v0] Missing required fields")
      return res.status(400).json({ error: "Amount, name, email, and phone are required" })
    }

    const mid = process.env.AIRPAY_MERCHANT_ID
    const username = process.env.AIRPAY_USERNAME
    const password = process.env.AIRPAY_PASSWORD
    const secret = process.env.AIRPAY_SECRET

    const orderid = order_id || `ORDER_${Date.now()}`
    const amountValue = Number.parseFloat(amount).toFixed(2)

    const nameParts = name.trim().split(" ")
    const buyerFirstName = nameParts[0] || name
    const buyerLastName = nameParts.slice(1).join(" ") || ""

    const buyerEmail = email
    const buyerPhone = phone
    const buyerAddress = "NA"
    const buyerCity = "NA"
    const buyerState = "NA"
    const buyerCountry = "India"
    const buyerPinCode = "000000"

    const alldata =
      buyerEmail +
      buyerFirstName +
      buyerLastName +
      buyerAddress +
      buyerCity +
      buyerState +
      buyerCountry +
      amountValue +
      orderid

    const udata = username + ":|:" + password
    const privatekey = crypto
      .createHash("sha256")
      .update(secret + "@" + udata)
      .digest("hex")

    const keySha256 = crypto
      .createHash("sha256")
      .update(username + "~:~" + password)
      .digest("hex")

    // Note: Official sample has 'var now = new Date()' at module level (bug),
    // but we create it per request for correctness
    const now = new Date()
    const currentDate = dateformat(now, "yyyy-mm-dd")
    const aldata = alldata + currentDate

    const checksum = crypto
      .createHash("sha256")
      .update(keySha256 + "@" + aldata)
      .digest("hex")


    const paymentUrl = "https://payments.airpay.co.in/pay/index.php"

    await Payment.create({
      orderId: orderid,
      gateway: "airpay",
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      paymentSessionId: orderid,
      status: "initiated",
    })


    res.json({
      success: true,
      paymentUrl: paymentUrl,
      paymentData: {
        mercid: mid,
        buyerEmail: buyerEmail,
        buyerFirstName: buyerFirstName,
        buyerLastName: buyerLastName,
        buyerAddress: buyerAddress,
        buyerCity: buyerCity,
        buyerState: buyerState,
        buyerCountry: buyerCountry,
        buyerPhone: buyerPhone,
        buyerPinCode: buyerPinCode,
        amount: amountValue,
        orderid: orderid,
        currency: "356",
        isocurrency: "INR",
        privatekey: privatekey,
        checksum: checksum,
        customvar: "Regenta Payment",
        txnsubtype: "",
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
    const { TRANSACTIONID, APTRANSACTIONID, AMOUNT, TRANSACTIONSTATUS, MESSAGE, ap_SecureHash, CHMOD, CUSTOMERVPA } =
      req.body

    if (!TRANSACTIONID) {
      console.error("[v0] ❌ Missing TRANSACTIONID in Airpay callback")
      console.error("[v0] This might mean Airpay is sending to wrong URL")
      console.error("[v0] Expected URL: https://api.regentainternational.in/api/airpay/callback")
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=missing_txn_id`)
    }

    const mid = process.env.AIRPAY_MERCHANT_ID
    const username = process.env.AIRPAY_USERNAME

    let txnhash = CRC32.str(
      TRANSACTIONID +
        ":" +
        APTRANSACTIONID +
        ":" +
        AMOUNT +
        ":" +
        TRANSACTIONSTATUS +
        ":" +
        MESSAGE +
        ":" +
        mid +
        ":" +
        username,
    )

    const chmod = CHMOD
    const custmvar = CUSTOMERVPA
    if (chmod === "upi") {
      txnhash = CRC32.str(
        TRANSACTIONID +
          ":" +
          APTRANSACTIONID +
          ":" +
          AMOUNT +
          ":" +
          TRANSACTIONSTATUS +
          ":" +
          MESSAGE +
          ":" +
          mid +
          ":" +
          username +
          ":" +
          custmvar,
      )
    }

    txnhash = txnhash >>> 0


    if (txnhash.toString() !== ap_SecureHash) {
      console.error("[v0] ❌ Hash verification failed!")
      console.error("[v0] Payment might be tampered or invalid")
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=invalid_hash`)
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

      res.redirect(`${process.env.FRONTEND_URL}/payment/success?txnId=${TRANSACTIONID}&amount=${AMOUNT}`)
    } else {
      await Payment.findOneAndUpdate({ orderId: TRANSACTIONID }, { status: "failed", updatedAt: Date.now() })

      console.log("[v0] ❌ Payment failed, redirecting to failed page")
      console.log("[v0] Failure reason:", MESSAGE)
      console.log("[v0] ========== END AIRPAY V3 CALLBACK ==========")
      res.redirect(
        `${process.env.FRONTEND_URL}/payment/failed?txnId=${TRANSACTIONID}&reason=${encodeURIComponent(MESSAGE || "Payment failed")}`,
      )
    }
  } catch (error) {
    console.error("[v0] ❌ Error processing Airpay callback:", error)
    console.error("[v0] Error stack:", error.stack)
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=processing_error`)
  }
})

dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
