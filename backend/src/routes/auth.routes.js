import { Router } from 'express';
import { checkEmail, forgotPassword, getMe, githubOAuth, googleOAuth, login, register, resendOtp, resetPassword, updateProfile, verifyOtp, verifyResetToken } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/check-email', checkEmail);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/google-oauth', googleOAuth);
router.post('/github-oauth', githubOAuth);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);

export default router;
