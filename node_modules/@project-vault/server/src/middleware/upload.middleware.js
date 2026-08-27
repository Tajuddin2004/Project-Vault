import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists at backend root
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Storage engine ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

// ── File filter ───────────────────────────────────────────────────────────────
function fileFilter(_req, file, cb) {
  const allowed = [
    // zip / archives
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip',
    // images (thumbnails / avatars)
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // documents (resumes / CVs)
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
}

// ── Multer instance ───────────────────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max per file
  },
});

/**
 * Build a publicly accessible URL for an uploaded file.
 * @param {Express.Request} req
 * @param {Express.Multer.File} file
 * @returns {string}
 */
export function fileUrl(req, file) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${file.filename}`;
}
