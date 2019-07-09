import UserService from '../services/user.service.db';
import ErrorMessage from '../helper/error';

const { createUser } = UserService;

const { serverErrorMessage } = ErrorMessage;

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
  static async createUser(req, res) {
    try {
      const result = await createUser(req.body);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }
}

export default UserController;
