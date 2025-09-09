import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for OAuth users
  googleId: { type: String }, // Only for Google users (legacy)
  clerkId: { type: String, unique: true, sparse: true }, // Clerk user ID
  role: { type: String, enum: ['student', 'admin'], required: true }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);