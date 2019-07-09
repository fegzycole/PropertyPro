import _ from 'lodash';
import Db from '../Db/index';
import Helper from '../helper/helper';

const { hashAPassword, createToken } = Helper;

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
  static async createUser(userDetails) {
    const {
      email, firstName, lastName, password, phoneNumber, address, type,
    } = userDetails;
    try {
      const hashedPassword = hashAPassword(password);

      const isAdmin = type === 'agent' || type === 'Agent';

      const query = 'INSERT INTO users (email, first_name, last_name, password, phone_number, address, type, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *';

      const { rows } = await Db.query(query, [email, firstName, lastName,
        hashedPassword, phoneNumber, address, type, isAdmin]);

      rows[0].token = createToken(userDetails);

      const response = _.pick(rows[0], ['id', 'email', 'first_name', 'last_name', 'is_admin', 'token']);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default UserService;
