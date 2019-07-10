/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import dotenv from 'dotenv';
import ErrorMessages from '../helper/error';
import Db from '../Db/index';

const {
  authorizationErrorResponse,
  ForbiddenErrorResponse,
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
    const { isAdmin, is_admin } = req.decoded.user;

    if (isAdmin || is_admin) return next();

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
  static async checkPropertyIdAndVerifyOwner(req, res, next) {
    try {
      const query = 'SELECT * FROM properties where id = $1';

      const { rows } = await Db.query(query, [parseInt(req.params.id, 10)]);

      if (!rows[0]) throw new Error('Property with the provided id not found');

      const owner = _.pick(rows[0], ['owner']);

      if (parseInt(req.decoded.user.id, 10) !== parseInt(owner.owner, 10)) {
        throw new Error('You are not permitted to view this resource');
      }

      return next();
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }
}

export default Auth;
