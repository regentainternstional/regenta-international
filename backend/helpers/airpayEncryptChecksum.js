import crypto from "crypto"

/**
 * Generate Airpay private key using checksum encryption
 * Matches official Airpay implementation
 * @param {string} data - User data string (username + ':|:' + password)
 * @param {string} salt - Secret/API key
 * @returns {string} SHA256 hash of salt@data
 */


export function airpayEncryptChecksum(data, salt) {
  const key = crypto.createHash("sha256").update(`${salt}@${data}`).digest("hex")
  return key
}
