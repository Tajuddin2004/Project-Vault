import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    ownerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName:     { type: String },           // denormalised for search results
    title:         { type: String, required: true, trim: true },
    category:      { type: String, enum: ['Medical', 'Real Estate', 'Technology'], required: true },
    subCategory:   { type: String },
    description:   { type: String, maxlength: 3000 },
    readme:        { type: String },
    thumbnailUrl:  { type: String },
    imageUrls:     [String],
    githubUrl:     { type: String },
    liveUrl:       { type: String },
    /** Path to the uploaded zip / archive stored on server */
    zipFileUrl:    { type: String },
    /** Original filename of the uploaded zip */
    zipFileName:   { type: String },
    technologies:  [String],
    status: {
      type: String,
      enum: ['draft', 'pending_verification', 'in_review', 'published'],
      default: 'pending_verification',
    },
    healthScore:   { type: Number, min: 0, max: 100, default: 95 },
  },
  { timestamps: true }
);

// Full-text index for global search
projectSchema.index({ title: 'text', description: 'text', technologies: 'text', ownerName: 'text' });

export default mongoose.model('Project', projectSchema);
