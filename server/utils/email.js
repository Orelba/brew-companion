import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'development' ? false : true, // Bypass certificate validation
    },
  })

  const emailOptions = {
    from: '"BrewCompanion Support" <BrewCompanion@trial-0r83ql3d070gzw1j.mlsender.net>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(emailOptions)
}

export { sendEmail }
