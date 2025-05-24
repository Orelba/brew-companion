import mongoose from 'mongoose'
import { randomBytes, createHash } from 'node:crypto'

const Schema = mongoose.Schema

const sessionSchema = new Schema({
  token: { type: String, required: true }, // refresh token
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  lastUsedAt: { type: Date, default: Date.now },
  userAgent: String,
  ip: String,
})

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  sessions: [sessionSchema], // supports multiple sessions
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
  passwordChangedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

UserSchema.methods.createResetPasswordToken = function () {
  const token = randomBytes(32).toString('hex')

  this.passwordResetToken = createHash('sha256').update(token).digest('hex')
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

  return token
}

export default mongoose.model('User', UserSchema)
