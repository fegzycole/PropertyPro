import UserService from '../services/user.service';

const { createUserAccount } = UserService;

class UserController {
  static createUserAccount(req, res) {
    try {
      const userInformation = req.body;
      const result = createUserAccount(userInformation);
      return res.status(201).json({
        status: 'success',
        data: {
          token: result[0],
          id: result[1],
          firstName: result[3],
          lastName: result[4],
          email: result[2],
          isAdmin: result[5],
        },
      });
    } catch (error) {
      return res.json({
        status: 500,
        error,
      });
    }
  }
}

export default UserController;
