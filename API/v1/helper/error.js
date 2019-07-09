import Helper from './helper';

const { deleteUploadedFile } = Helper;

class ErrorMessages {
  /**
   *
   * Handles the response for when a user puts in a password that doesn't exist
   * @static
   * @param {Object} res
   * @param {Object} err
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static displayDescriptiveError(req, err) {
    let error;
    if (err === 'getaddrinfo ENOTFOUND api.cloudinary.com api.cloudinary.com:443') {
      error = 'Check your internet connection and try again';
      return error;
    }
    deleteUploadedFile(req);
    return err;
  }

  /**
   *
   * Handles the response for when a user puts in a password that doesn't exist
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static incorrectUserPassword(res) {
    return res.status(401).json({
      status: 401,
      error: 'Email or password incorrect',
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
   * Handles the response for when a user puts in an email not in the database
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static emailDoesNotExistErrorResponse(res) {
    return res.status(401).json({
      status: 401,
      error: 'Email or password incorrect',
    });
  }

  /**
   *
   * Handles the response for when a validation fails
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static isInvalidResponses(res, typeOfParameter) {
    let error;
    const status = 422;
    if (typeOfParameter === 'type') error = 'Only Agent or User allowed';
    if (typeOfParameter === 'first name') error = 'Invalid first name provided';
    if (typeOfParameter === 'last name') error = 'Invalid last name provided';
    if (typeOfParameter === 'address') error = 'Invalid address provided. A valid address is at least seven characters long';
    if (typeOfParameter === 'state') error = 'Invalid state provided. Valid example: Lagos State';
    if (typeOfParameter === 'city') error = 'Invalid city provided. Make sure the city is in the state selected';
    if (typeOfParameter === 'email') error = 'Invalid email provided';
    if (typeOfParameter === 'password') error = 'Invalid password provided. A valid password is at least six characters long';
    if (typeOfParameter === 'phone number') error = 'Invalid phone number provided. A valid phone number is 07057154456';
    if (typeOfParameter === 'property type') error = 'Invalid property type selected. A valid property type is either 2 Bedroom, 3 Bedroom, Land, or a Semi-detached duplex';
    if (typeOfParameter === 'price') error = 'Invalid price provided';
    if (typeOfParameter === 'status') error = 'Invalid status provided. You can only mark a property as \'Sold\'';
    res.status(status).json({
      status,
      error,
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static isEmptyErrorResponse(res, typeOfParameter) {
    const status = 400;
    const error = `${typeOfParameter} cannot be left empty`;
    return res.status(status).json({
      status,
      error,
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static ForbiddenErrorResponse(res) {
    return res.status(403).json({
      status: 403,
      error: 'You are not authorized to view this resource',
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static propertyNotFoundErrorResponse(res) {
    return res.status(404).json({
      status: 404,
      error: 'Property with the specified id not found',
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @param {Object} e
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static authorizationErrorResponse(res, e) {
    return res.status(401).send({
      status: 401,
      error: e.message,
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static propertyTypeError(res) {
    return res.status(404).json({
      status: 404,
      error: 'No property with the specified type',
    });
  }


  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static contentTypeErrorResponse(res) {
    return res.status(400).json({
      status: 400,
      error: 'Change your content type and try again',
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static genericErrorResponse(res, err) {
    return res.status(400).json({
      status: 400,
      error: err.message,
    });
  }

  /**
   *
   * Handles the response for when a required request parameter is left empty
   * @static
   * @param {Object} res
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static serverErrorMessage(err, res) {
    let statusCode;
    if (err.message === 'Authorization failed. Email or password incorrect') {
      statusCode = 401;
      return res.status(statusCode).json({
        status: statusCode,
        error: err.message,
      });
    }
    if (err.message === 'Property with the provided id not found') {
      statusCode = 404;
      return res.status(statusCode).json({
        status: statusCode,
        error: err.message,
      });
    }
    if (err.message === 'You are not permitted to view this resource') {
      statusCode = 403;
      return res.status(statusCode).json({
        status: statusCode,
        error: err.message,
      });
    }
    statusCode = 500;
    const error = 'Internal Server Error';
    return res.status(statusCode).json({
      status: statusCode,
      error,
    });
  }
}

export default ErrorMessages;
