import _ from 'lodash';
import Db from '../Db/index';
import Helper from '../helper/helper';

const {
  hashAPassword,
  createToken,
  loginAUser,
  compareUserPasswordv2,
} = Helper;

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

    const hashedPassword = hashAPassword(password);

    const isAdmin = type === 'agent' || type === 'Agent';

    const query = 'INSERT INTO users (email, first_name, last_name, password, phone_number, address, type, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *';

    const { rows } = await Db.query(query, [email, firstName, lastName,
      hashedPassword, phoneNumber, address, type, isAdmin]);

    const payLoad = _.pick(rows[0], ['id', 'email', 'first_name', 'last_name', 'is_admin']);

    rows[0].token = createToken(payLoad);

    const response = _.pick(rows[0], ['id', 'email', 'first_name', 'last_name', 'is_admin', 'token']);

    response.id = parseInt(response.id, 10);
    return response;
  }


  /** Handles the logic for logging a user in
   * @static
   * @param {Object} userDetails request body
   * @returns {Object} containing required details of the user or an error object
   * @memberof UserService
   */
  static async loginUser(user) {
    const { email, password } = user.body;
    const userInfo = await loginAUser(email);

    if (!userInfo) throw new Error('Authorization failed. Email or password incorrect');

    const payLoad = _.pick(userInfo, ['id', 'email', 'first_name', 'last_name', 'is_admin']);

    const comparePassword = await compareUserPasswordv2(email, password);

    if (!comparePassword) throw new Error('Authorization failed. Email or password incorrect');

    userInfo.token = createToken(payLoad);

    const response = _.pick(userInfo, ['id', 'email', 'first_name', 'last_name', 'is_admin', 'token']);

    response.id = parseInt(response.id, 10);

    return response;
  }
}

export default UserService;
