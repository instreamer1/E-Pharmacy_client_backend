// services/userService.js

import UserModel from '../db/models/User.js';

export const signup = async (data) => {
  const newUser = await UserModel.create(data);
  return newUser;
};

export const firstUser = async () => UserModel.countDocuments();

export const findUser = (filter) => UserModel.findOne(filter);

export const findUserByEmail = (filter) =>
  UserModel.findOne(filter).select('+password');

export const findUserById = (filter) => {
  return UserModel.findById(filter).select('-password -__v');
};

export const updateUser = (filter, updateData) => {
  return UserModel.findOneAndUpdate(
    filter,
    { $set: updateData },
    { new: true },
  );
};

export const userService = {
  updateUser: (filter, updateData) => {
    return UserModel.findOneAndUpdate(filter, updateData, { new: true });
  },
  getUserById: (filter) => {
    return UserModel.findOne(filter);
  },
};

export const findAllUsers = () => UserModel.find();
