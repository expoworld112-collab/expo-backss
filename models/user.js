import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      lowercase: true,
      unique: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      required: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    about: {
      type: String
    },
    role: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ''
    }
  },
  { 
    timestamps: true // fixed from 'timestamp: true'
  }
);

// Virtual field for password
userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;          // temporary variable
    this.salt = this.makeSalt();        // generate salt
    this.hashed_password = this.encryptPassword(password); // encrypt password
  })
  .get(function() {
    return this._password;
  });

// Methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
