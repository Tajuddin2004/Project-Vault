# Service boundary

- `auth/`: password hashing, JWT and GitHub OAuth.
- `email/`: OTP, welcome and newsletter email delivery.
- `storage/`: Cloudinary/S3 upload adapter.
- `github/`: repository import and resync.
- `search/`: MongoDB Atlas Search queries.

Controllers own HTTP requests and responses. Provider SDK calls belong in these services.
