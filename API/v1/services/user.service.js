/* eslint-disable camelcase */
import Helper from '../helper/helper';
import userData from '../data/user.data';
import User from '../model/user.model';

const { hashAPassword, createToken, compareUserPassword } = Helper;
/**
 * @exports UserService
 * @class UserService
 */
class UserService {
  /** Handles the logic for creating a new user
   * @static
   * @param {Object} userDetails request body
   * @returns {Object} containing required details of the newly created user or an error object
   * @memberof UserService
   */
  static createUserAccount(userDetails) {
    const {
      email, first_name, last_name, password, phone_number, address,
    } = userDetails;

    try {
      const hashedPassword = hashAPassword(password);

      const id = userData.users.length + 1;

      const is_admin = false;

      const newUser = new User(id, email, first_name,
        last_name, hashedPassword, phone_number, address, is_admin);

      userData.users.push(newUser);

      const res = {
        token: createToken(newUser),
        id,
        email,
        first_name,
        last_name,
      };

      return res;
    } catch (error) {
      return error;
    }
  }

  /** Handles the logic for logging a user in
   * @static
   * @param {Object} userDetails request body
   * @returns {Object} containing required details of the user or an error object
   * @memberof UserService
   */
  static loginUser(userDetails) {
    try {
      const { email, password } = userDetails;

      const userInfo = userData.users.find(el => el.email === email);

      const comparePassword = compareUserPassword(email, password);

      if (comparePassword) {
        const res = {
          token: createToken(userInfo),
          id: userInfo.id,
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
        };

        return res;
      }
      return false;
    } catch (error) {
      return error;
    }
  }
}

export default UserService;
