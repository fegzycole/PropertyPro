import UserService from '../services/user.service';
import ErrorMessages from '../helper/error';

const { incorrectUserPassword } = ErrorMessages;

const { createUserAccount, loginUser } = UserService;
/**
 * @exports UserController
 * @class UserController
 */
class UserController {
  /**
   * Creates a new user account
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof UserController
   */
  static createUserAccount(req, res) {
    const userInformation = req.body;
    const result = createUserAccount(userInformation);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  /**
   * Logs in a user
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response or an error response if the password  is incorrect
   * @memberof UserController
   */
  static loginUser(req, res) {
    const userCredentials = req.body;
    const result = loginUser(userCredentials);
    if (result) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }
    return incorrectUserPassword(res);
  }
}

export default UserController;
