import UserService from '../services/user.service';
import Validation from '../middleware/validation';

const { incorrectUserPassword } = Validation;

const { createUserAccount, loginUser } = UserService;

class UserController {
  static createUserAccount(req, res) {
    try {
      const userInformation = req.body;
      const result = createUserAccount(userInformation);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return res.json({
        status: 400,
        error,
      });
    }
  }

  static loginUser(req, res) {
    try {
      const userCredentials = req.body;
      const result = loginUser(userCredentials);
      if (result) {
        return res.status(201).json({
          status: 'success',
          data: result,
        });
      }
      return incorrectUserPassword(res);
    } catch (error) {
      return error;
    }
  }
}

export default UserController;
