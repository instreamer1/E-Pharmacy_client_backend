//models/Session.js


import { Schema, model } from 'mongoose';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessJti: {
      type: String,
      required: true,
      unique: true,
    },
    refreshJti: {
      type: String,
      required: true,
      unique: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

sessionSchema.index({ accessJti: 1 });
sessionSchema.index({ refreshJti: 1 });


sessionSchema.pre('findOneAndUpdate', setUpdateSettings);
sessionSchema.post('save', mongooseSaveError);
sessionSchema.post('findOneAndUpdate', mongooseSaveError);

const Session = model('session', sessionSchema);

export default Session;

