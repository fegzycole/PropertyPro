import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userData from '../data/user.data';

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

  static checkIfEmailExists(emailToCheckAgainst) {
    const resultingArray = userData.users.find(el => el.email === emailToCheckAgainst);
    return resultingArray;
  }

  static compareUserPassword(email, password) {
    const usersInformation = userData.users.find(el => el.email === email);
    const hashDatabasePassword = Helper.hashAPassword(usersInformation.password);
    const comparePasswords = bcrypt.compareSync(password, hashDatabasePassword);
    return comparePasswords;
  }
}

export default Helper;
