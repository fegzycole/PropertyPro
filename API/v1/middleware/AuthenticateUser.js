/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorMessages from '../helper/error';
import Db from '../Db/index';

const {
  authorizationErrorResponse,
  contentTypeErrorResponse,
  serverErrorMessage,
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
      console.log(1, req.headers);
      console.log(2, req.body);
      if (!req.headers['x-access-token'] && !req.headers.token && (!req.headers.authorization) && (!req.body.token) && (!req.body.Authorization)) throw new Error('You do not have access to this resource');
      const token = req.body.token || req.headers['x-access-token'];
      const decoded = jwt.verify(token, process.env.SECRET);
      req.decoded = decoded;
      console.log('I passed this');
      return next();
    } catch (e) {
      return authorizationErrorResponse(res, e);
    }
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
  static async checkPropertyId(req, res, next) {
    try {
      const query = 'SELECT * FROM properties where id = $1';

      const { rows } = await Db.query(query, [parseInt(req.params.id, 10)]);

      if (!rows[0]) throw new Error('Property with the provided id not found');

      return next();
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }
}

export default Auth;
