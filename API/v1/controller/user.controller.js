import UserService from '../services/user.service';
import Validation from '../middleware/validation';

const { incorrectUserPassword } = Validation;

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
