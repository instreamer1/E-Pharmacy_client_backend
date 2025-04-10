//utils/hash.js

import bcrypt from 'bcrypt';

export const hashPassword = async (value) => {
  const hashPassword = await bcrypt.hash(value, 10);
  return hashPassword;
};

export const comparePassword = (value, hash) => bcrypt.compare(value, hash);
