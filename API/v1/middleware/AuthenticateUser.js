import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Auth {
  static authenticateUser(req, res, next) {
    try {
      if (!req.headers['x-access-token']) throw new Error('You do not have access to this resource');
      const token = req.body.token || req.headers['x-access-token'];
      const decoded = jwt.verify(token, process.env.SECRET);
      req.decoded = decoded;
      return next();
    } catch (e) {
      return res.status(401).send({
        status: 401,
        error: e.message,
      });
    }
  }

  static authenticateAnAdmin(req, res, next) {
    try {
      const { isAdmin } = req.decoded.user;
      if (isAdmin) return next();
      throw new Error('Only an Agent can post a property');
    } catch (e) {
      return res.status(401).send({
        status: 401,
        error: e.message,
      });
    }
  }
}

export default Auth;
