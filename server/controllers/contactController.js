import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import { validateContactData } from '../middleware/validateContactData.js'
import Contact from '../models/contact.js'
import { sendEmail } from '../utils/email.js'

const sendContactMessage = [
  ...validateContactData,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    }

    const { name, category = 'general', message } = req.body
    const isAuthenticated = !!req.user

    // Use authenticated user's email if available, otherwise use form email
    const email = isAuthenticated ? req.user.email : req.body.email

    const contact = await Contact.create({
      name,
      email,
      category,
      message,
      userId: req.user?._id ?? null,
    })

    try {
      await sendEmail({
        email: process.env.SMTP_USER,
        replyTo: email,
        subject: `BrewCompanion [${category}]: Message from ${name}`,
        message: isAuthenticated
          ? `--- Authenticated User ---\nUser ID: ${req.user._id}\nUsername: ${req.user.username}\nEmail: ${req.user.email}\nMember since: ${req.user.createdAt}\n\n--- Message ---\nName: ${name}\nCategory: ${category}\n\n${message}`
          : `--- Guest ---\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\n--- Message ---\n${message}`,
      })

      contact.emailSent = true
      await contact.save()
    } catch (err) {
      contact.emailError = err.message
      await contact.save()
      console.error('Contact email failed (message saved):', err.message)
    }

    res.json({ success: true })
  }),
]

export { sendContactMessage }
