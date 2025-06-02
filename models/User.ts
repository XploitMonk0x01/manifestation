import mongoose from 'mongoose'

const wishSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique creates index
  password: { type: String },
  profilePic: { type: String, default: '' },
  wishes: [wishSchema],
})

// Remove this line to avoid duplicate index warning:
// userSchema.index({ email: 1 });

userSchema.index({ 'wishes.isPublic': 1 }) // This is fine

export default mongoose.models.User || mongoose.model('User', userSchema)
