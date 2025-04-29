import mongoose from 'mongoose'
import { randomBytes, createHash } from 'node:crypto'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
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
