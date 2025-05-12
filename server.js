// server.js
require('dotenv').config()
const AWS = require('aws-sdk')
const express = require('express')
const path = require('path')
const fs = require('fs')
const { console } = require('inspector')

const app = express()
// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

app.get('/noc/Ecertificate', async (req, res) => {
  const q = req.query.q
  if (!q) {
    return res.status(400).send('❌ Missing certificate identifier.')
  }
  var urlPath = null
  // Build the S3 object key
  if (q.startsWith('NPTEL25CS')) {
    urlPath = `/NOC/NOC25/SEM1/Ecertificates/106/noc25-cs19/Course/${encodeURIComponent(
      q,
    )}.pdf`
  } else if (q.startsWith('NPTEL25MG')) {
    urlPath = `/NOC/NOC25/SEM1/Ecertificates/110/noc25-mg74/Course/${encodeURIComponent(
      q,
    )}.pdf`
  }
  console.log(urlPath)
  try {
    // Send the HTML page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <center style="position: absolute;top: 40%;left: 50%;transform: translate(-50%, -50%);"><a href="${urlPath}" target="_blank" style="color:white; background-color:#3070bf;padding:10px 20px;border-radius:8px;text-decoration:none;display: inline-block;width: 156px;">Course Certificate</a><br></center>
      </body>
      </html>
    `)
  } catch (err) {
    console.error(err)
    res.status(500).send('❌ Could not generate download link.')
  }
})

app.use(
  '/NOC',
  express.static(path.join(__dirname, 'NOC'), {
    fallthrough: false, // gives 404 if file not found
  }),
)
// Route to serve the certificate page

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`)
})
