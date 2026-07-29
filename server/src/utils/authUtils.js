const bcrypt = require("bcrypt");

// Password Hash Karna
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Password Compare Karna
const comparePassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};