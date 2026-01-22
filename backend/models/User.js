const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
      // ===================================
      // AUTHENTICATION
      // ===================================
      email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
      },
      password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters']
      },

      // OTP for email verification and login
      otp: {
            code: String,
            expiresAt: Date,
            verified: { type: Boolean, default: false }
      },

      // Two-factor authentication
      twoFactorAuth: {
            enabled: { type: Boolean, default: false },
            secret: String
      },

      // ===================================
      // PROFILE INFORMATION
      // ===================================
      profile: {
            fullName: {
                  type: String,
                  trim: true
            },
            bio: {
                  type: String,
                  maxlength: [500, 'Bio cannot exceed 500 characters']
            },
            avatar: {
                  type: String,
                  default: ''
            },
            skills: [{
                  type: String,
                  trim: true
            }],
            techStack: [{
                  type: String,
                  trim: true
            }],
            niche: {
                  type: String,
                  trim: true
            },
            portfolioLinks: [{
                  title: String,
                  url: String
            }]
      },

      // ===================================
      // SOCIAL MEDIA CONNECTIONS
      // ===================================
      socialMedia: {
            youtube: {
                  channelId: String,
                  channelName: String,
                  channelUrl: String,
                  connected: { type: Boolean, default: false }
            },
            linkedin: {
                  profileId: String,
                  profileUrl: String,
                  connected: { type: Boolean, default: false }
            },
            twitter: {
                  username: String,
                  profileUrl: String,
                  connected: { type: Boolean, default: false }
            },
            instagram: {
                  username: String,
                  profileUrl: String,
                  connected: { type: Boolean, default: false }
            }
      },

      // ===================================
      // ROLE-BASED ACCESS CONTROL
      // ===================================
      role: {
            type: String,
            enum: ['creator', 'admin', 'collaborator'],
            default: 'creator'
      },
      permissions: [{
            type: String
      }],

      // ===================================
      // PREFERENCES
      // ===================================
      preferences: {
            theme: {
                  type: String,
                  enum: ['light', 'dark', 'system'],
                  default: 'system'
            },
            language: {
                  type: String,
                  enum: ['en', 'hi', 'en-hi'],
                  default: 'en'
            },
            notifications: {
                  email: { type: Boolean, default: true },
                  push: { type: Boolean, default: true },
                  sms: { type: Boolean, default: false }
            },
            timezone: {
                  type: String,
                  default: 'Asia/Kolkata'
            }
      },

      // ===================================
      // ACCOUNT METADATA
      // ===================================
      isVerified: {
            type: Boolean,
            default: false
      },
      isActive: {
            type: Boolean,
            default: true
      },
      lastLogin: {
            type: Date
      },
      loginAttempts: {
            type: Number,
            default: 0
      },
      lockUntil: {
            type: Date
      }
}, {
      timestamps: true
});

// ===================================
// INDEXES
// ===================================
userSchema.index({ email: 1 });
userSchema.index({ 'socialMedia.youtube.channelId': 1 });

// ===================================
// PASSWORD HASHING
// ===================================
userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) return next();

      try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
      } catch (error) {
            next(error);
      }
});

// ===================================
// METHODS
// ===================================
// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
      return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function () {
      // Reset attempts if lock has expired
      if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.updateOne({
                  $set: { loginAttempts: 1 },
                  $unset: { lockUntil: 1 }
            });
      }

      const updates = { $inc: { loginAttempts: 1 } };
      const maxAttempts = 5;
      const lockTime = 2 * 60 * 60 * 1000; // 2 hours

      // Lock account after max attempts
      if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
            updates.$set = { lockUntil: Date.now() + lockTime };
      }

      return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function () {
      return this.updateOne({
            $set: { loginAttempts: 0 },
            $unset: { lockUntil: 1 }
      });
};

// Remove sensitive data
userSchema.methods.toJSON = function () {
      const user = this.toObject();
      delete user.password;
      delete user.otp;
      delete user.twoFactorAuth.secret;
      return user;
};

module.exports = mongoose.model('User', userSchema);
