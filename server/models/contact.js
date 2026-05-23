import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ['general', 'feedback', 'bug'],
      default: 'general',
      required: true,
    },
    message: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emailSent: { type: Boolean, default: false }, // did the email go through?
    emailError: { type: String }, // log the error if not
  },
  { timestamps: true }
)

export default mongoose.model('Contact', ContactSchema)
