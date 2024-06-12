import bcryptjs from "bcryptjs";

export const encrypt = (password) => {
  const salt = bcryptjs.genSaltSync();
  const encryptedPassword = bcryptjs.hashSync(password, salt);
  return encryptedPassword;
};
