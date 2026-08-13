import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import EmailOtp from '../models/EmailOtp.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import User from '../models/User.js';
import { sendOtpEmail, sendPasswordResetLinkEmail, sendWelcomeEmail } from '../services/email.service.js';
import { generateToken } from '../utils/jwt.js';

// Password validation rule: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
function validatePasswordRules(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number (0-9).';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must contain at least one special symbol (!@#$%^&*...).';
  }
  return null;
}

export async function checkEmail(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ exists: false });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    res.status(200).json({ exists: !!(user && user.isEmailVerified) });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password, newsletterOptIn } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const pwError = validatePasswordRules(password);
    if (pwError) {
      return res.status(400).json({ message: pwError });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' });
      }
      // Re-use existing unverified record
      const salt = await bcrypt.genSalt(10);
      existingUser.name = name.trim();
      existingUser.passwordHash = await bcrypt.hash(password, salt);
      existingUser.newsletterOptIn = !!newsletterOptIn;
      await existingUser.save();
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        newsletterOptIn: !!newsletterOptIn,
        isEmailVerified: false,
      });
    }

    // Generate 6-digit OTP
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpSalt = await bcrypt.genSalt(8);
    const codeHash = await bcrypt.hash(rawOtp, otpSalt);

    await EmailOtp.deleteMany({ email: normalizedEmail });
    await EmailOtp.create({
      email: normalizedEmail,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes TTL
    });

    await sendOtpEmail(normalizedEmail, rawOtp);

    res.status(201).json({
      message: 'Registration initiated. Verification OTP sent to your email.',
      email: normalizedEmail,
      requiresOtp: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await EmailOtp.findOne({ email: normalizedEmail });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or invalid. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), otpRecord.codeHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect OTP code.' });
    }

    await EmailOtp.deleteMany({ email: normalizedEmail });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isEmailVerified = true;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function googleOAuth(req, res, next) {
  try {
    const { name, email, department } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required for Google OAuth.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // New user registration flow
      const userName = name || normalizedEmail.split('@')[0];
      user = await User.create({
        name: userName.trim(),
        email: normalizedEmail,
        role: 'student',
        isEmailVerified: true,
        profile: { department: department || 'Computer Science' },
      });
      await sendWelcomeEmail(user.email, user.name);
    } else {
      // Existing user account (created via Email/Password or OAuth) -> Link & Sign In
      user.isEmailVerified = true;
      if (name && (!user.name || user.name === normalizedEmail.split('@')[0])) {
        user.name = name.trim();
      }
      if (department && (!user.profile?.department)) {
        user.profile = { ...(user.profile || {}), department };
      }
      await user.save();
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(200).json({
      message: 'Signed in with Google successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function githubOAuth(req, res, next) {
  try {
    const { name, email, githubUrl, isSignUp } = req.body;
    const userEmail = (email || 'github.user@projectvault.io').toLowerCase().trim();

    let user = await User.findOne({ email: userEmail });

    if (isSignUp && user && user.isEmailVerified) {
      return res.status(409).json({
        message: 'An account with this email already exists. Please sign in.',
        accountExists: true,
      });
    }

    if (!user) {
      user = await User.create({
        name: name || 'GitHub Developer',
        email: userEmail,
        role: 'student',
        isEmailVerified: true,
        profile: { githubUrl: githubUrl || 'https://github.com', department: 'Computer Engineering' },
      });
      await sendWelcomeEmail(user.email, user.name);
    } else {
      user.isEmailVerified = true;
      await user.save();
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(200).json({
      message: 'GitHub OAuth authentication successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpSalt = await bcrypt.genSalt(8);
    const codeHash = await bcrypt.hash(rawOtp, otpSalt);

    await EmailOtp.deleteMany({ email: normalizedEmail });
    await EmailOtp.create({
      email: normalizedEmail,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(normalizedEmail, rawOtp);

    res.status(200).json({
      message: 'A new OTP code has been sent to your email.',
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate 32-byte secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes TTL from now

    // Store in User document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Also store in dedicated PasswordResetToken collection (for visibility in Compass)
    await PasswordResetToken.deleteMany({ email: normalizedEmail });
    await PasswordResetToken.create({
      email: normalizedEmail,
      token,
      expiresAt: resetPasswordExpires,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    // URL contains ONLY token - NO email parameter!
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    await sendPasswordResetLinkEmail(normalizedEmail, resetUrl);

    res.status(200).json({
      message: 'A secure password reset link has been sent to your email address.',
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyResetToken(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ valid: false, message: 'Reset token is required.' });
    }

    // Check PasswordResetToken collection first, fallback to User
    let tokenRecord = await PasswordResetToken.findOne({ token });
    let email = tokenRecord?.email;
    let expiresAt = tokenRecord?.expiresAt;

    if (!tokenRecord) {
      const user = await User.findOne({ resetPasswordToken: token });
      if (!user) {
        return res.status(400).json({ valid: false, message: 'Invalid or already used password reset link.' });
      }
      email = user.email;
      expiresAt = user.resetPasswordExpires;
    }

    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Password reset link has expired (30-minute limit exceeded).' });
    }

    res.status(200).json({
      valid: true,
      expiresAt,
      email,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required.' });
    }

    const pwError = validatePasswordRules(newPassword);
    if (pwError) {
      return res.status(400).json({ message: pwError });
    }

    let tokenRecord = await PasswordResetToken.findOne({ token });
    let targetEmail = tokenRecord?.email;

    if (!tokenRecord) {
      const u = await User.findOne({ resetPasswordToken: token });
      if (!u) {
        return res.status(400).json({ message: 'Invalid or already used password reset link. Please request a new link.' });
      }
      targetEmail = u.email;
      if (u.resetPasswordExpires && u.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: 'Password reset link has expired (30-minute limit exceeded). Please request a new link.' });
      }
    } else {
      if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Password reset link has expired (30-minute limit exceeded). Please request a new link.' });
      }
    }

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash, isEmailVerified: true },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
      }
    );

    await PasswordResetToken.deleteMany({ email: targetEmail });

    res.status(200).json({
      message: 'Password updated successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isEmailVerified) {
      // Trigger OTP flow for unverified login
      const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
      const otpSalt = await bcrypt.genSalt(8);
      const codeHash = await bcrypt.hash(rawOtp, otpSalt);

      await EmailOtp.deleteMany({ email: normalizedEmail });
      await EmailOtp.create({
        email: normalizedEmail,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      await sendOtpEmail(normalizedEmail, rawOtp);

      return res.status(403).json({
        message: 'Your email is not verified yet. A verification OTP has been sent to your inbox.',
        requiresOtp: true,
        email: normalizedEmail,
        devOtpHint: process.env.NODE_ENV !== 'production' ? rawOtp : undefined,
      });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(200).json({
      message: 'Signed in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        profile: req.user.profile || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, department, college, bio, githubUrl, linkedinUrl, avatarUrl, roleTitle, phone, location, skills, education, experiences, resumeFile } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name && name.trim()) {
      user.name = name.trim();
    }

    user.profile = {
      ...(user.profile || {}),
      department: department !== undefined ? department : user.profile?.department,
      college: college !== undefined ? college : user.profile?.college,
      bio: bio !== undefined ? bio : user.profile?.bio,
      githubUrl: githubUrl !== undefined ? githubUrl : user.profile?.githubUrl,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : user.profile?.linkedinUrl,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : user.profile?.avatarUrl,
      roleTitle: roleTitle !== undefined ? roleTitle : user.profile?.roleTitle,
      phone: phone !== undefined ? phone : user.profile?.phone,
      location: location !== undefined ? location : user.profile?.location,
      skills: skills !== undefined ? skills : user.profile?.skills,
      education: education !== undefined ? education : user.profile?.education,
      experiences: experiences !== undefined ? experiences : user.profile?.experiences,
      resumeFile: resumeFile !== undefined ? resumeFile : user.profile?.resumeFile,
    };

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
}
