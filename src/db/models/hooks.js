//db/models/hooks.js

import bcrypt from 'bcrypt';

export const mongooseSaveError = (error, data, next) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const hashPasswordIfModified = async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};

export const setUpdateSettings = async function (next) {
  this.options.new = true;
  this.options.runValidators = true;

  const update = this.getUpdate();

  if (update?.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
};
