/* eslint-disable max-len */
import isEmpty from './isEmpty';
import Helper from '../helper/helper';

const { trimmer, checkIfEmailExists } = Helper;

class Validation {
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
    if (!regexForEmail.test(trimmedRequestParameters[0])) return Validation.isInvalidResponses(res, 'email');
    if (!regexForNames.test(trimmedRequestParameters[1])) return Validation.isInvalidResponses(res, 'First Name');
    if (!regexForNames.test(trimmedRequestParameters[2])) return Validation.isInvalidResponses(res, 'Last Name');
    if (!regexForPassword.test(trimmedRequestParameters[3])) return Validation.isInvalidResponses(res, 'password');
    if (!regexForPhoneNumber.test(trimmedRequestParameters[4])) return Validation.isInvalidResponses(res, 'phoneNumber');
    if (!regexForUserType.test(trimmedRequestParameters[5])) return Validation.isInvalidResponses(res, 'type');
    return next();
  }

  static checkForEmptyRequestParameters(req, res, next) {
    const userInformation = req.body;
    const {
      email, firstName, lastName, password, phoneNumber, address, type,
    } = userInformation;
    if (isEmpty(email)) return Validation.isEmptyErrorResponse(res, 'email');
    if (isEmpty(firstName)) return Validation.isEmptyErrorResponse(res, 'Name');
    if (isEmpty(lastName)) return Validation.isEmptyErrorResponse(res, 'Name');
    if (isEmpty(password)) return Validation.isEmptyErrorResponse(res, 'password');
    if (isEmpty(phoneNumber)) return Validation.isEmptyErrorResponse(res, 'phoneNumber');
    if (isEmpty(address)) return Validation.isEmptyErrorResponse(res, 'address');
    if (isEmpty(type)) return Validation.isEmptyErrorResponse(res, 'type');
    return next();
  }

  static checkForEmptySignInParameters(req, res, next) {
    const { email, password } = req.body;
    if (isEmpty(email)) return Validation.isEmptyErrorResponse(res, 'email');
    if (isEmpty(password)) return Validation.isEmptyErrorResponse(res, 'password');
    return next();
  }

  static isEmptyErrorResponse(res, typeOfParameter) {
    let error;
    const status = 400;
    if (typeOfParameter === 'email') error = 'Email field cannot be left empty';
    if (typeOfParameter === 'Name') error = 'First Name/Last Name field cannot be left empty';
    if (typeOfParameter === 'password') error = 'Password field cannot be left empty';
    if (typeOfParameter === 'phoneNumber') error = 'Phone Number field cannot be left empty';
    if (typeOfParameter === 'address') error = 'Address field cannot be left empty';
    if (typeOfParameter === 'type') error = 'User type field cannot be left empty';
    res.status(status).json({
      status,
      error,
    });
  }

  static isInvalidResponses(res, typeOfParameter) {
    let error;
    const status = 422;
    if (typeOfParameter === 'email') error = 'Invalid Email address provided';
    if (typeOfParameter === 'First Name') error = 'Invalid First Name provided';
    if (typeOfParameter === 'Last Name') error = 'Invalid Last Name provided';
    if (typeOfParameter === 'password') error = 'Invalid Password provided, remove whitespace(s) and try again';
    if (typeOfParameter === 'phoneNumber') error = 'Invalid Phone Number provided';
    if (typeOfParameter === 'type') error = 'Only Agent or User allowed';
    res.status(status).json({
      status,
      error,
    });
  }

  static checkLoginParameters(req, res, next) {
    const { email } = req.body;
    const trimmedParameters = trimmer([email]);
    if (!checkIfEmailExists(trimmedParameters[0])) return Validation.emailDoesNotExistErrorResponse(res);
    return next();
  }

  static emailDoesNotExistErrorResponse(res) {
    return res.status(404).json({
      status: 404,
      error: 'Email does not exist',
    });
  }

  static incorrectUserPassword(res) {
    return res.status(401).json({
      status: 401,
      error: 'Authentication Failed',
    });
  }
}

export default Validation;
