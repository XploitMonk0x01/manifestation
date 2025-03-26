import mongoose from "mongoose";

const wishSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the wish
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePic: { type: String, default: "" },
  wishes: [wishSchema],
});

userSchema.index({ email: 1 }); // Index on email for faster lookups
userSchema.index({ "wishes.isPublic": 1 }); // Index on isPublic for faster public wish queries

export default mongoose.models.User || mongoose.model("User", userSchema);