import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorMessages from '../helper/error';

const {
  authorizationErrorResponse,
  ForbiddenErrorResponse,
  contentTypeErrorResponse,
} = ErrorMessages;

dotenv.config();

/**
 *
 * @exports Auth
 * @class Auth
 */
class Auth {
  /**
   *
   * Checks if a user is logged in  and has a valid token
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Auth
   */
  static authenticateUser(req, res, next) {
    try {
      if (!req.headers['x-access-token']) throw new Error('You do not have access to this resource');
      const token = req.body.token || req.headers['x-access-token'];
      const decoded = jwt.verify(token, process.env.SECRET);
      req.decoded = decoded;
      return next();
    } catch (e) {
      return authorizationErrorResponse(res, e);
    }
  }

  /**
   *
   * Checks to see if a user is an agent
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Auth
   */
  static authenticateAnAdmin(req, res, next) {
    const { isAdmin } = req.decoded.user;
    if (isAdmin) return next();
    return ForbiddenErrorResponse(res);
  }

  /**
   *
   * Checks to see if the correct content-type is specified
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Auth
   */
  static checkContentType(req, res, next) {
    const { headers } = req;
    if (headers['content-type'] === 'application/x-www-form-urlencoded') {
      return contentTypeErrorResponse(res);
    }
    return next();
  }
}

export default Auth;
