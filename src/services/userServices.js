// services/userService.js

import UsersCollection from '../db/models/User.js';

export const signup = async (data) => {
  const newUser = await UsersCollection.create(data);
  return newUser;
};

export const findUser = (filter) => UsersCollection.findOne(filter);

export const findUserByEmail = (filter) =>
  UsersCollection.findOne(filter).select('+password');

export const findUserById = (filter) => {
  return UsersCollection.findById(filter).select('-password -__v');
};

export const updateUser = (filter, updateData) => {
  return UsersCollection.findOneAndUpdate(filter, { $set: updateData }, { new: true });
};


export const userService = {
  updateUser: (filter, updateData) => {
    return UsersCollection.findOneAndUpdate(filter, updateData, { new: true });
  },
  getUserById: (filter) => {
    return UsersCollection.findOne(filter);
  },
};

export const findAllUsers = () => UsersCollection.find();
