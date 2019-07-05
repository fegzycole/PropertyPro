/* eslint-disable prefer-const */
/* eslint-disable max-len */
import isEmpty from './isEmpty';
import Helper from '../helper/helper';
import ErrorClass from '../helper/error';

const {
  cityWithoutStateResponse,
  emailDoesNotExistErrorResponse,
  isInvalidResponses,
  isEmptyErrorResponse,
  ForbiddenErrorResponse,
  propertyNotFoundErrorResponse,
} = ErrorClass;

const {
  checkIfEmailExists,
  checkState,
  checkLGA,
  deleteUploadedFile,
  checkId,
  compareAgents,
  checkForInvalidSignupKeys,
  checkForMultipleKeys,
} = Helper;

/**
 *
 * @exports Validation
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
    const validKeys = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address', 'type'];

    checkForInvalidSignupKeys(req.body, validKeys);

    checkForMultipleKeys(req.body);

    const userInformation = req.body;

    const {
      email, firstName, lastName, password, phoneNumber, type, address,
    } = userInformation;

    const regexForEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    const regexForNames = /^[a-zA-Z][a-zA-Z]*$/;
    const regexForPhoneNumber = /^[0]\d{10}$/;
    const regexForUserType = /^(agent|user)$/;

    if (!regexForEmail.test(email)) {
      return isInvalidResponses(res, 'Email');
    }

    if (!regexForNames.test(firstName)) {
      return isInvalidResponses(res, 'First Name');
    }

    if (!regexForNames.test(lastName)) {
      return isInvalidResponses(res, 'Last Name');
    }

    if (password.length < 6) {
      return isInvalidResponses(res, 'Password');
    }

    if (!regexForPhoneNumber.test(phoneNumber)) {
      return isInvalidResponses(res, 'Phone Number');
    }

    if (!regexForUserType.test(type)) {
      return isInvalidResponses(res, 'type');
    }

    if (address <= 6) {
      return isInvalidResponses(res, 'address');
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
    const validKeys = ['type', 'price', 'state', 'city', 'address'];

    const userInformation = req.body;

    const {
      type, price, state, city, address,
    } = userInformation;

    const regexForPrice = /^\d*\.?\d*$/;

    checkForInvalidSignupKeys(req.body, validKeys);

    checkForMultipleKeys(req.body);

    if (!checkState(state)) {
      deleteUploadedFile(req);
      return isInvalidResponses(res, 'state');
    }
    if (!checkLGA(state, city)) {
      deleteUploadedFile(req);
      return isInvalidResponses(res, 'city');
    }
    if (!validTypes.includes(type)) {
      deleteUploadedFile(req);
      return isInvalidResponses(res, 'property type');
    }
    if (!regexForPrice.test(price)) {
      deleteUploadedFile(req);
      return isInvalidResponses(res, 'price');
    }
    if (address.length <= 6) {
      deleteUploadedFile(req);
      return isInvalidResponses(res, 'address');
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
      return isEmptyErrorResponse(res, 'Email');
    }

    if (isEmpty(firstName)) {
      return isEmptyErrorResponse(res, 'First Name/Last Name');
    }

    if (isEmpty(lastName)) {
      return isEmptyErrorResponse(res, 'First Name/Last Name');
    }

    if (isEmpty(password)) {
      return isEmptyErrorResponse(res, 'Password');
    }

    if (isEmpty(phoneNumber)) {
      return isEmptyErrorResponse(res, 'Phone Number');
    }

    if (isEmpty(address)) {
      return isEmptyErrorResponse(res, 'Address');
    }

    if (isEmpty(type)) {
      return isEmptyErrorResponse(res, 'Type');
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
      return isEmptyErrorResponse(res, 'image');
    }

    if (isEmpty(price)) {
      deleteUploadedFile(req);
      return isEmptyErrorResponse(res, 'price');
    }
    if (isEmpty(state)) {
      deleteUploadedFile(req);
      return isEmptyErrorResponse(res, 'state');
    }
    if (isEmpty(city)) {
      deleteUploadedFile(req);
      return isEmptyErrorResponse(res, 'city');
    }
    if (isEmpty(address)) {
      deleteUploadedFile(req);
      return isEmptyErrorResponse(res, 'address');
    }
    if (isEmpty(type)) {
      deleteUploadedFile(req);
      return isEmptyErrorResponse(res, 'type');
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
      return propertyNotFoundErrorResponse(res);
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
      return ForbiddenErrorResponse(res);
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
      return isInvalidResponses(res, 'status');
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
    const validKeys = ['email', 'password'];

    checkForInvalidSignupKeys(req.body, validKeys);

    checkForMultipleKeys(req.body);

    const { email, password } = req.body;

    if (isEmpty(email)) {
      return isEmptyErrorResponse(res, 'email');
    }

    if (isEmpty(password)) {
      return isEmptyErrorResponse(res, 'password');
    }
    return next();
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
    if (!checkIfEmailExists(email)) {
      return emailDoesNotExistErrorResponse(res);
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
      return isInvalidResponses(res, 'property type');
    }

    if (price && !regexForPrice.test(price)) {
      return isInvalidResponses(res, 'price');
    }

    if (city && !state) {
      return cityWithoutStateResponse(res, 'state');
    }

    if (state && !city) {
      return cityWithoutStateResponse(res, 'city');
    }

    if (state && !checkState(state)) {
      return isInvalidResponses(res, 'state');
    }

    if ((city && state) && (!checkLGA(state, city))) {
      return isInvalidResponses(res, 'city');
    }

    if (address && isEmpty(address)) {
      return isEmptyErrorResponse(res, 'address');
    }

    return next();
  }
}

export default Validation;
