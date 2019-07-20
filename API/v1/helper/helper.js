/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import userData from '../data/user.data';
import properties from '../data/property.data';
import Db from '../Db/index';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 *
 * @exports
 * @class Helper
 */
class Helper {
  /**
   *
   * Hashes a password
   * @static
   * @param {String} passwordToBeHashed
   * @returns {String} hashed password
   * @memberof Helper
   */
  static hashAPassword(passwordToBeHashed) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwordToBeHashed, salt);
  }

  /**
   * @static
   * Creates a token for a user
   * @param {Object} user
   * @returns {String} created token
   * @memberof Helper
   */
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

  /**
   * Searches the database for a user whose email matches the supplied email
   * @static
   * @param {String} emailToCheckAgainst
   * @returns {Array} Empty array or an array containing a user's complete information
   * @memberof Helper
   */
  static checkIfEmailExists(emailToCheckAgainst) {
    const resultingArray = userData.users.find(el => el.email === emailToCheckAgainst);
    return resultingArray;
  }

  /**
   * Deletes an uploaded image if validation fails
   * @static
   * @param {Object} req
   * @returns {void}
   * @memberof Helper
   */
  static async deleteUploadedFile(req) {
    await cloudinary.uploader.destroy(req.file.public_id);
    return null;
  }

  /**
   *
   * Hashes a supplied password and compares the supplied password with the password in the database
   * for the user with the provided email
   * @static
   * @param {String} email
   * @param {String} password
   * @returns {Boolean} true if the passwords match, false if they do not match
   * @memberof Helper
   */
  static compareUserPassword(email, password) {
    const usersInformation = userData.users.find(el => el.email === email);
    const hashDatabasePassword = Helper.hashAPassword(usersInformation.password);
    const comparePasswords = bcrypt.compareSync(password, hashDatabasePassword);
    return comparePasswords;
  }

  /**
   *
   * Hashes a supplied password and compares the supplied password with the password in the database
   * for the user with the provided email
   * @static
   * @param {String} email
   * @param {String} password
   * @returns {Boolean} true if the passwords match, false if they do not match
   * @memberof Helper
   */
  static async compareUserPasswordv2(email, password) {
    const query = 'SELECT * from users WHERE email = $1';
    const { rows } = await Db.query(query, [email]);
    const comparePasswords = bcrypt.compareSync(password, rows[0].password);
    return comparePasswords;
  }

  // /**
  //  *
  //  * Checks to see if the state supplied is a valid state in the array of states
  //  * @static
  //  * @param {String} stateToCheckAgainst
  //  * @returns {Array}
  //  * @memberof Helper
  //  */
  // static checkState(stateToCheckAgainst) {
  //   const resultingArray = states.states.find(el => el.state.name === stateToCheckAgainst);
  //   return resultingArray;
  // }

  // /**
  //  * Checks to see if the specified city is a valid city in the state selected
  //  * @static
  //  * @param {String} state
  //  * @param {String} lga
  //  * @returns {Array} an empty array or an array containing a city that matches the specified city
  //  * @memberof Helper
  //  */
  // static checkLGA(state, lga) {
  //   const arrayOfStates = states.states.find(el => el.state.name === state);
  //   const LGAs = Object.values(arrayOfStates.state.locals);
  //   const resultingArray = LGAs.find(local => local.name === lga);
  //   return resultingArray;
  // }

  /**
   * @static
   * @param {Integer} id
   * @returns {Array} an empty array or an array containing an id that matches the specified id
   * @memberof Helper
   */
  static checkId(id) {
    const resultingArray = properties.properties.find(el => el.id === id);
    return resultingArray;
  }

  /**
   * Gets all the properties and the email and phone numbers of their respective agents
   * @static
   * @param {Array} arrayToUse
   * @returns {Array}
   * @memberof Helper
   */
  static getProperties(arrayToUse) {
    const userInfo = userData.users.map(user => user);

    const ArrayOfAllProperties = arrayToUse.map((property) => {
      userInfo.forEach((user) => {
        if (user.id === property.owner) {
          property.ownerEmail = user.email;
          property.ownerPhoneNumber = user.phoneNumber;
        }
      });

      return property;
    });

    return ArrayOfAllProperties;
  }

  static checkForInvalidSignupKeys(req, validKeys) {
    const arrayOfKeys = Object.keys(req);
    arrayOfKeys.forEach((el) => {
      if (!validKeys.includes(el)) {
        throw new Error(`${el} is not a valid request parameter`);
      }
      return null;
    });
  }

  static checkForMultipleKeys(req) {
    const arrayOfKeys = Object.entries(req);
    arrayOfKeys.forEach((el) => {
      if (typeof el[1] === 'object') {
        throw new Error(`Duplicate key ${el[0]}, please remove one and try again`);
      }
    });
  }

  static async loginAUser(email) {
    const query = 'SELECT * from users WHERE email = $1';
    const { rows } = await Db.query(query, [email]);
    if (rows[0]) return rows[0];
    return false;
  }

  static async checkPropertyType(propertyType) {
    const query = 'SELECT * from properties WHERE type = $1';
    const { rows } = await Db.query(query, [propertyType]);
    if (rows[0]) return rows[0];
    return false;
  }

  static generateQuery(req) {
    const props = Object.entries(req.body);
    const validParams = props.filter(el => el[1] !== '' && el[0] !== 'Authorization' && el[0] !== 'token');
    const queryString = validParams.map(el => el[0]);

    const parameters = validParams.map(el => el[1]);
    return [queryString, parameters];
  }
}

export default Helper;
