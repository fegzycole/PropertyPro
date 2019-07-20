/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
import isEmpty from './isEmpty';
import Helper from '../helper/helper';
import ErrorClass from '../helper/error';

const {
  emailDoesNotExistErrorResponse,
  isInvalidResponses,
  propertyNotFoundErrorResponse,
  serverErrorMessage,
} = ErrorClass;

const {
  checkIfEmailExists,
  deleteUploadedFile,
  checkId,
  checkForInvalidSignupKeys,
  checkForMultipleKeys,
  compareUserPasswordv2,
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
    const userInformation = req.body;
    const error = {};
    const {
      email, first_name, last_name, password, phone_number, address,
    } = userInformation;
    const regexForEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    const regexForNames = /^[a-zA-Z]{3,}$/;
    const regexForPhoneNumber = /^[0]\d{10}$/;
    if (isEmpty(email)) error.email = 'Email cannot be left empty';
    if (isEmpty(first_name)) error.first_name = 'First Name/Last Name cannot be left empty';
    if (isEmpty(last_name)) error.last_name = 'First Name/Last Name cannot be left empty';
    if (isEmpty(password)) error.password = 'Password cannot be left empty';
    if (isEmpty(phone_number)) error.phone_number = 'Phone Number cannot be left empty';
    if (isEmpty(address)) error.address = 'Address cannot be left empty';
    if (email && !regexForEmail.test(email)) error.email = 'Invalid email provided';
    if (first_name && !regexForNames.test(first_name)) error.first_name = 'Invalid first name provided';
    if (last_name && !regexForNames.test(last_name)) error.last_name = 'Invalid last name provided';
    if (password && password.length < 6) error.password = 'Invalid password provided. A valid password is at least six characters long';
    if (phone_number && !regexForPhoneNumber.test(phone_number)) error.phone_number = 'Invalid phone number provided. A valid phone number is 07057154456';
    if (address && address.length <= 6) error.address = 'Invalid address provided. A valid address is at least seven characters long';
    if (!isEmpty(error)) {
      return res.status(400).json({
        status: 'error',
        error,
      });
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
  static async validatePropertyInput(req, res, next) {
    const imageUrl = req.file;
    const error = {};
    const userInformation = req.body;
    const {
      type, price, state, city, address, image_url,
    } = userInformation;
    const regexForPrice = /^\d*\.?\d*$/;
    const regexForStatesAndCities = /^[a-zA-Z ]{4,}$/;
    try {
      if (isEmpty(imageUrl) && isEmpty(image_url)) error.image = 'image cannot be left empty';
      if (isEmpty(price)) error.price = 'price cannot be left empty';
      if (isEmpty(state)) error.state = 'state cannot be left empty';
      if (isEmpty(city)) error.city = 'city cannot be left empty';
      if (isEmpty(address)) error.address = 'address cannot be left empty';
      if (isEmpty(type)) error.property_type = 'type cannot be left empty';
      if (state && !regexForStatesAndCities.test(state)) error.state = 'Invalid state provided. A valid state is at least 4 characters long without numbers and special characters';
      if (city && !regexForStatesAndCities.test(city)) error.city = 'Invalid city provided. A valid city is at least 4 characters long without numbers and special characters';
      if (type && type.length < 4) error.property_type = 'Invalid property type selected. A valid property type is at least four characters long';
      if (price && !regexForPrice.test(price, res)) error.price = 'Invalid price provided';
      if (address && address.length <= 6) error.address = 'Invalid address provided. A valid address is at least seven characters long';
      if (!isEmpty(error)) {
        if (!isEmpty(imageUrl)) await deleteUploadedFile(req);
        return res.status(400).json({
          status: 'error',
          error,
        });
      }
      return next();
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        error: err.message,
      });
    }
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
   * Checks to see if a valid new status is provided for a property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @returns {(function|Object)} function next() or an error response object
   * @memberof Validation
   */
  static validateId(req, res, next) {
    const { id } = req.params;

    if (isNaN(id)) {
      return isInvalidResponses(res, 'id');
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
    const error = {};
    checkForInvalidSignupKeys(req.body, validKeys, res);
    checkForMultipleKeys(req.body, res);
    const { email, password } = req.body;
    if (isEmpty(email)) error.email = 'email cannot be left empty';
    if (isEmpty(password)) error.password = 'password cannot be left empty';
    if (!isEmpty(error)) {
      return res.status(400).json({
        status: 'error',
        error,
      });
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
    const {
      type, price, state, city, address,
    } = req.body;
    const error = {};
    const regexForPrice = /^\d*\.?\d*$/;
    const regexForStatesAndCities = /^[a-zA-Z ]{4,}$/;
    if (type && type.length < 4) error.property_type = 'Invalid property type selected. A valid property type is at least four characters long';
    if (price && !regexForPrice.test(price)) error.price = 'Invalid price provided';
    if (state && (!regexForStatesAndCities.test(state))) error.state = 'Invalid state provided. A valid state is at least 4 characters long without numbers and special characters';
    if (city && (!regexForStatesAndCities.test(city))) error.city = 'Invalid city provided. A valid city is at least 4 characters long without numbers and special characters';
    if (address && (address.length <= 6)) error.address = 'Invalid address provided. A valid address is at least seven characters long';
    if (!isEmpty(error)) {
      return res.status(400).json({
        status: 'error',
        error,
      });
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
  static checkResetPasswordProperties(req, res, next) {
    try {
      const validKeys = ['password', 'new_password'];
      checkForInvalidSignupKeys(req.body, validKeys);
      checkForMultipleKeys(req.body);
      return next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message,
      });
    }
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
  static async validateResetPassword(req, res, next) {
    try {
      const { email } = req.params;
      const { password, new_password } = req.body;
      if (password && !new_password) throw new Error('specify a new password to proceed');
      if (!password && new_password) throw new Error('specify your old password to proceed');
      if (password && new_password) {
        if (new_password.length < 6) throw new Error('New password must be at least 6 characters long');
        const comparePassword = await compareUserPasswordv2(email, password);
        if (!comparePassword) throw new Error('The password specified is not the same as what is saved in the database');
        if (password === new_password) throw new Error('The new password cannot be the same as the old one');
        return next();
      }
      return next();
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }
}

export default Validation;
