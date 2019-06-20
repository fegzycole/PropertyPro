import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Helper {
  static trimmer(array) {
    const trimmedParameters = array.map(el => el.trim().toLowerCase());
    return trimmedParameters;
  }

  static hashAPassword(passwordToBeHashed) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwordToBeHashed, salt);
  }

  static createToken(user) {
    const token = jwt.sign(
      {
        user,
      },
      process.env.SECRET,
      { expiresIn: '24h' },
    );

    return token;
  }
}

export default Helper;
