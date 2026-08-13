import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Medical', 'Real Estate', 'Technology'], required: true },
  subcategory: String,
  description: { type: String, maxlength: 3000 },
  readme: String,
  thumbnailUrl: String,
  imageUrls: [String],
  githubUrl: String,
  liveUrl: String,
  zipFileUrl: String,
  technologies: [String],
  status: { type: String, enum: ['draft', 'pending_detection', 'detected', 'analyzed', 'ready_for_review', 'approved', 'published'], default: 'draft' },
  healthScore: { type: Number, min: 0, max: 100 },
}, { timestamps: true });

projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });
export default mongoose.model('Project', projectSchema);
