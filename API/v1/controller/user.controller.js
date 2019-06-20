import UserService from '../services/user.service';

const { createUserAccount } = UserService;

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
}

export default UserController;
