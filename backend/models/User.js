import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Made optional for username-only users
  username: { type: String, unique: true, sparse: true }, // For username-only authentication
  password: { type: String }, // Not required for OAuth users
  googleId: { type: String }, // Only for Google users (legacy)
  clerkId: { type: String, unique: true, sparse: true }, // Clerk user ID
  role: { type: String, enum: ['student', 'admin'], required: true }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);