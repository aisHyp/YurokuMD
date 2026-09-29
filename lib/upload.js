/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━ © 2026 Lunar Saurus ━━━━━━━━━━━━━━━━━━
 */
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

const uploader = {}

uploader.saurusdev = async (filePath) => {
  try {
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://uploads.saurusdev.cloud/api/upload",
      form,
      { headers: { ...form.getHeaders() } }
    )

    if (!res.data?.success || !res.data?.url) {
      throw new Error("Upload gagal (saurusdev)")
    }

    return res.data.url
  } catch (err) {
    throw new Error("Saurusdev CDN error: " + err.message)
  }
}

uploader.catbox = async (filePath) => {
  try {
    const form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("fileToUpload", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://catbox.moe/user/api.php",
      form,
      { headers: { ...form.getHeaders() } }
    )

    if (!res.data.startsWith("https://")) {
      throw new Error("Upload gagal (catbox)")
    }

    return res.data.trim()
  } catch (err) {
    throw new Error("Catbox error: " + err.message)
  }
}

uploader.uguu = async (filePath) => {
  try {
    const form = new FormData()
    form.append("files[]", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://uguu.se/upload.php",
      form,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
          ...form.getHeaders()
        }
      }
    )

    if (!res.data?.files?.[0]?.url) {
      throw new Error("Upload gagal (uguu)")
    }

    return res.data.files[0].url
  } catch (err) {
    throw new Error("Uguu error: " + err.message)
  }
}

uploader.auto = async (filePath) => {
  const providers = [uploader.saurusdev, uploader.uguu, uploader.catbox]
  let lastError
  for (const provider of providers) {
    try {
      return await provider(filePath)
    } catch (err) {
      lastError = err
    }
  }
  throw lastError || new Error("Semua provider upload gagal")
}

export default uploader