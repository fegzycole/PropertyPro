import UserService from '../services/user.service';
import Validation from '../middleware/validation';

const { incorrectUserPassword } = Validation;

const { createUserAccount, loginUser } = UserService;

class UserController {
  static createUserAccount(req, res) {
    const userInformation = req.body;
    const result = createUserAccount(userInformation);
    if (result) {
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    }
    return res.json({
      status: 500,
      error: 'Request Failed. Failed to create new account',
    });
  }

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
