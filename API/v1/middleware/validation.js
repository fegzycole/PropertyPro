/* eslint-disable prefer-const */
/* eslint-disable max-len */
import isEmpty from './isEmpty';
import Helper from '../helper/helper';
import uploader from './imageUpload';

const {
  trimmer, checkIfEmailExists, checkState, checkLGA, deleteUploadedFile,
} = Helper;

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
    if (!regexForEmail.test(trimmedRequestParameters[0])) return Validation.isInvalidResponses(res, 'Email');
    if (!regexForNames.test(trimmedRequestParameters[1])) return Validation.isInvalidResponses(res, 'First Name');
    if (!regexForNames.test(trimmedRequestParameters[2])) return Validation.isInvalidResponses(res, 'Last Name');
    if (!regexForPassword.test(trimmedRequestParameters[3])) return Validation.isInvalidResponses(res, 'Password');
    if (!regexForPhoneNumber.test(trimmedRequestParameters[4])) return Validation.isInvalidResponses(res, 'Phone Number');
    if (!regexForUserType.test(trimmedRequestParameters[5])) return Validation.isInvalidResponses(res, 'type');
    return next();
  }

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

  static checkForEmptyRequestParameters(req, res, next) {
    const userInformation = req.body;
    const {
      email, firstName, lastName, password, phoneNumber, address, type,
    } = userInformation;
    if (isEmpty(email)) return Validation.isEmptyErrorResponse(res, 'Email');
    if (isEmpty(firstName)) return Validation.isEmptyErrorResponse(res, 'First Name/Last Name');
    if (isEmpty(lastName)) return Validation.isEmptyErrorResponse(res, 'First Name/Last Name');
    if (isEmpty(password)) return Validation.isEmptyErrorResponse(res, 'Password');
    if (isEmpty(phoneNumber)) return Validation.isEmptyErrorResponse(res, 'Phone Number');
    if (isEmpty(address)) return Validation.isEmptyErrorResponse(res, 'Address');
    if (isEmpty(type)) return Validation.isEmptyErrorResponse(res, 'Type');
    return next();
  }


  static checkForEmptyPropertyPostParameters(req, res, next) {
    const imageUrl = req.file;
    const userInformation = req.body;
    const {
      address, type, price, state, city,
    } = userInformation;
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
    if (isEmpty(imageUrl)) return Validation.isEmptyErrorResponse(res, 'image');
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
    error = `${typeOfParameter} cannot be left empty`;
    res.status(status).json({
      status,
      error,
    });
  }

  static isInvalidResponses(res, typeOfParameter) {
    let error;
    const status = 422;
    error = typeOfParameter === 'type' ? 'Only Agent or User allowed' : `Invalid ${typeOfParameter} provided`;
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
