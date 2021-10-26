import bcrypt from "bcrypt";
const hashPassword = async (password: string, saltRounds = 10) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash password
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error);
  }

  // Return null if error
  return null;
};

const comparePassword = async (password, hash) => {
  try {
    // Compare password
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }

  // Return false if error
  return false;
};

export { comparePassword, hashPassword };
