// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {
  hashPasswordIfModified,
  mongooseSaveError,
  setUpdateSettings,
} from './hooks.js';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (email) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email),
        message: 'Please provide a valid email address',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
        message: 'Please provide a valid phone number',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [7, 'Password must be at least 7 characters'],
      maxlength: [30, 'The password must be no more than 30 characters long.'],
      validate: {
        validator: (password) => /^\S+$/.test(password),
        message: 'Please provide a valid password',
      },
      select: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', hashPasswordIfModified);

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
  virtuals: true,
  versionKey: false,
});

UserSchema.pre('findOneAndUpdate', setUpdateSettings);
UserSchema.post('save', mongooseSaveError);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
