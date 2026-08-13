import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema);
