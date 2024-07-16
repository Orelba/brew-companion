import mongoose from 'mongoose'

const validateMongoDBObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: `Invalid MongoDB Object ID: ${req.params.id}` })
  }
  next()
}

export default validateMongoDBObjectId
