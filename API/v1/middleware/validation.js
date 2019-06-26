/* eslint-disable prefer-const */
/* eslint-disable max-len */
import isEmpty from './isEmpty';
import Helper from '../helper/helper';
import uploader from './imageUpload';

const {
  trimmer, checkIfEmailExists, checkState,
  checkLGA, deleteUploadedFile, checkId, compareAgents,
} = Helper;

/**
 *
 *exports
 * @class Validation
 */
class Validation {
  /**
   *
   * Handles user input validation checks
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static validateSignUpInput(req, res, next) {
    const userInformation = req.body;

    const {
      email, firstName, lastName, password, phoneNumber, type,
    } = userInformation;

    const trimmedRequestParameters = trimmer([email, firstName, lastName, password, phoneNumber, type]);

    const regexForEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    const regexForNames = /^[a-zA-Z][a-zA-Z]*$/;
    const regexForPassword = /^\S+$/;
    const regexForPhoneNumber = /^[0]\d{10}$/;
    const regexForUserType = /^(agent|user)$/;

    if (!regexForEmail.test(trimmedRequestParameters[0])) {
      return Validation.isInvalidResponses(res, 'Email');
    }

    if (!regexForNames.test(trimmedRequestParameters[1])) {
      return Validation.isInvalidResponses(res, 'First Name');
    }

    if (!regexForNames.test(trimmedRequestParameters[2])) {
      return Validation.isInvalidResponses(res, 'Last Name');
    }

    if (!regexForPassword.test(trimmedRequestParameters[3])) {
      return Validation.isInvalidResponses(res, 'Password');
    }

    if (!regexForPhoneNumber.test(trimmedRequestParameters[4])) {
      return Validation.isInvalidResponses(res, 'Phone Number');
    }

    if (!regexForUserType.test(trimmedRequestParameters[5])) {
      return Validation.isInvalidResponses(res, 'type');
    }
    return next();
  }

  /**
   *
   * Handles the validation for creating a new property after checking for empty parameters
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static validateCreatePropertyInput(req, res, next) {
    const validTypes = ['2 Bedroom', '3 Bedroom', 'Land', 'Semi-detached duplex'];

    const userInformation = req.body;

    const {
      type, price, state, city,
    } = userInformation;

    const regexForPrice = /^\d*\.?\d*$/;

    if (!checkState(state)) {
      deleteUploadedFile(req);
      return Validation.isInvalidResponses(res, 'state');
    }
    if (!checkLGA(state, city)) {
      deleteUploadedFile(req);
      return Validation.isInvalidResponses(res, 'city');
    }
    if (!validTypes.includes(type)) {
      deleteUploadedFile(req);
      return Validation.isInvalidResponses(res, 'property type');
    }
    if (!regexForPrice.test(price)) {
      deleteUploadedFile(req);
      return Validation.isInvalidResponses(res, 'price');
    }
    return next();
  }

  /**
   *
   * Checks the body of the request for empty parameters when creating a new user
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkForEmptyRequestParameters(req, res, next) {
    const userInformation = req.body;

    const {
      email, firstName, lastName, password, phoneNumber, address, type,
    } = userInformation;

    if (isEmpty(email)) {
      return Validation.isEmptyErrorResponse(res, 'Email');
    }

    if (isEmpty(firstName)) {
      return Validation.isEmptyErrorResponse(res, 'First Name/Last Name');
    }

    if (isEmpty(lastName)) {
      return Validation.isEmptyErrorResponse(res, 'First Name/Last Name');
    }

    if (isEmpty(password)) {
      return Validation.isEmptyErrorResponse(res, 'Password');
    }

    if (isEmpty(phoneNumber)) {
      return Validation.isEmptyErrorResponse(res, 'Phone Number');
    }

    if (isEmpty(address)) {
      return Validation.isEmptyErrorResponse(res, 'Address');
    }

    if (isEmpty(type)) {
      return Validation.isEmptyErrorResponse(res, 'Type');
    }

    return next();
  }

  /**
   *
   * Checks the body of the request for empty parameters when creating a new user
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkForEmptyPropertyPostParameters(req, res, next) {
    const imageUrl = req.file;

    const userInformation = req.body;

    const {
      address, type, price, state, city,
    } = userInformation;

    if (isEmpty(imageUrl)) {
      return Validation.isEmptyErrorResponse(res, 'image');
    }

    if (isEmpty(price)) {
      deleteUploadedFile(req);
      return Validation.isEmptyErrorResponse(res, 'price');
    }
    if (isEmpty(state)) {
      deleteUploadedFile(req);
      return Validation.isEmptyErrorResponse(res, 'state');
    }
    if (isEmpty(city)) {
      deleteUploadedFile(req);
      return Validation.isEmptyErrorResponse(res, 'city');
    }
    if (isEmpty(address)) {
      deleteUploadedFile(req);
      return Validation.isEmptyErrorResponse(res, 'address');
    }
    if (isEmpty(type)) {
      deleteUploadedFile(req);
      return Validation.isEmptyErrorResponse(res, 'type');
    }
    return next();
  }

  /**
   *
   * Checks the Id provided in the request parameters to see if it exists
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkPropertyId(req, res, next) {
    if (!checkId(parseInt(req.params.id, 10))) {
      return res.status(404).json({
        status: 404,
        error: 'Property with the specified id not found',
      });
    }
    return next();
  }

  /**
   *
   * Uses the Id obtained in the request parameters to get the owner of that property and checks if the agent requesting is the true owner
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static compareAgentsById(req, res, next) {
    if (!compareAgents(req, parseInt(req.params.id, 10))) {
      return res.status(403).json({
        status: 403,
        error: 'You are not authorized to view this resource',
      });
    }
    return next();
  }

  /**
   *
   * Checks to see if a valid new status is provided for a property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkStatusParameter(req, res, next) {
    const { status } = req.body;

    if (status !== 'Sold') {
      return Validation.isInvalidResponses(res, 'status');
    }

    return next();
  }

  /**
   *
   * Checks to see if any required sign in field is ommited
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkForEmptySignInParameters(req, res, next) {
    const { email, password } = req.body;

    if (isEmpty(email)) {
      return Validation.isEmptyErrorResponse(res, 'email');
    }

    if (isEmpty(password)) {
      return Validation.isEmptyErrorResponse(res, 'password');
    }
    return next();
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof Validation
   */
  static isEmptyErrorResponse(res, typeOfParameter) {
    let error;
    const status = 400;
    error = `${typeOfParameter} cannot be left empty`;
    return res.status(status).json({
      status,
      error,
    });
  }

  /**
   *
   * Handles the response for when a validation fails
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof Validation
   */
  static isInvalidResponses(res, typeOfParameter) {
    let error;
    const status = 422;
    error = typeOfParameter === 'type' ? 'Only Agent or User allowed' : `Invalid ${typeOfParameter} provided`;
    res.status(status).json({
      status,
      error,
    });
  }

  /**
   *
   * Checks to see if the specified email exists in the database
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkLoginParameters(req, res, next) {
    const { email } = req.body;
    const trimmedParameters = trimmer([email]);
    if (!checkIfEmailExists(trimmedParameters[0])) {
      return Validation.emailDoesNotExistErrorResponse(res);
    }
    return next();
  }

  /**
   *
   * Handles the validation for updating a listed property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static checkForInvalidUpdateParameters(req, res, next) {
    const validTypes = ['2 Bedroom', '3 Bedroom', 'Land', 'Semi-detached duplex'];

    const {
      type, price, state, city, address,
    } = req.body;

    const regexForPrice = /^\d*\.?\d*$/;

    if (type && !validTypes.includes(type)) {
      return Validation.isInvalidResponses(res, 'property type');
    }

    if (price && !regexForPrice.test(price)) {
      return Validation.isInvalidResponses(res, 'price');
    }

    if (city && !state) {
      return Validation.cityWithoutStateResponse(res, 'state');
    }

    if (state && !city) {
      return Validation.cityWithoutStateResponse(res, 'city');
    }

    if (state && !checkState(state)) {
      return Validation.isInvalidResponses(res, 'state');
    }

    if ((city && state) && (!checkLGA(state, city))) {
      return Validation.isInvalidResponses(res, 'city');
    }

    if (address && isEmpty(address)) {
      return Validation.isEmptyErrorResponse(res, 'address');
    }

    return next();
  }

  /**
   *
   * Tries to upload an image and checks to see if there is an internet connection
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static uploadAnImage(req, res, next) {
    uploader(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: 'No internet connection, try again',
        });
      }
      return next();
    });
  }

  /**
   *
   * Handles the response for when a user puts in an email not in the database
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof Validation
   */
  static emailDoesNotExistErrorResponse(res) {
    return res.status(404).json({
      status: 404,
      error: 'Email does not exist',
    });
  }

  /**
   *
   * Handles the response when a property to be updated has a city but no state
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof Validation
   */
  static cityWithoutStateResponse(res, typeOfError) {
    return res.status(422).json({
      status: 422,
      error: `Invalid, select a ${typeOfError} to continue`,
    });
  }

  /**
   *
   * Handles the response for when a user puts in a password that doesn't exist
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof Validation
   */
  static incorrectUserPassword(res) {
    return res.status(401).json({
      status: 401,
      error: 'Authentication Failed',
    });
  }
}

export default Validation;
