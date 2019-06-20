import Helper from '../helper/helper';
import userData from '../data/user.data';
import User from '../model/user.model';

const { hashAPassword, createToken, compareUserPassword } = Helper;
class UserService {
  static createUserAccount(userDetails) {
    const {
      email, firstName, lastName, password, phoneNumber, address, type,
    } = userDetails;
    try {
      const hashedPassword = hashAPassword(password);
      const id = userData.users.length + 1;
      const isAdmin = type === 'agent' || type === 'Agent';
      const newUser = new User(id, email, firstName,
        lastName, hashedPassword, phoneNumber, address, isAdmin);
      userData.users.push(newUser);
      const res = {
        token: createToken(newUser),
        id,
        email,
        firstName,
        lastName,
        isAdmin,
      };
      return res;
    } catch (error) {
      return error;
    }
  }

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
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          isAdmin: userInfo.isAdmin,
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
