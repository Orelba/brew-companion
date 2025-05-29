import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls:
      process.env.NODE_ENV === 'development'
        ? { rejectUnauthorized: false }
        : undefined,
  })

  const emailOptions = {
    from: `"BrewCompanion Support" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(emailOptions)
}

export { sendEmail }
