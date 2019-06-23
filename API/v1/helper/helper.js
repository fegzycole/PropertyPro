import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import userData from '../data/user.data';
import states from '../data/statesAndLGAs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

  static deleteUploadedFile(req) {
    return cloudinary.uploader.destroy(req.file.public_id);
  }

  static compareUserPassword(email, password) {
    const usersInformation = userData.users.find(el => el.email === email);
    const hashDatabasePassword = Helper.hashAPassword(usersInformation.password);
    const comparePasswords = bcrypt.compareSync(password, hashDatabasePassword);
    return comparePasswords;
  }

  static checkState(stateToCheckAgainst) {
    const resultingArray = states.states.find(el => el.state.name === stateToCheckAgainst);
    return resultingArray;
  }

  static checkLGA(state, lga) {
    const arrayOfStates = states.states.find(el => el.state.name === state);
    const LGAs = Object.values(arrayOfStates.state.locals);
    const resultingArray = LGAs.find(local => local.name === lga);
    return resultingArray;
  }
}

export default Helper;
