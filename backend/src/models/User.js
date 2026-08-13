import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  department: String,
  college: String,
  bio: { type: String, maxlength: 1000 },
  avatarUrl: String,
  githubUrl: String,
  linkedinUrl: String,
  roleTitle: String,
  phone: String,
  location: String,
  skills: [String],
  education: Array,
  experiences: Array,
  resumeFile: {
    name: String,
    dataUrl: String,
    size: String,
    uploadDate: String,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: String,
  role: { type: String, enum: ['student', 'faculty', 'recruiter', 'admin'], default: 'student' },
  isEmailVerified: { type: Boolean, default: false },
  newsletterOptIn: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profile: profileSchema,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
