import Helper from './helper';

const { deleteUploadedFile } = Helper;

class ErrorMessages {
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
   * @param {string} typeOfParameter
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
    const status = 422;
    const error = typeOfParameter === 'type' ? 'Only Agent or User allowed' : `Invalid ${typeOfParameter} provided`;
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
   * @param {string} typeOfParameter
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
   * @param {string} typeOfParameter
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
   * @param {string} typeOfParameter
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
   * @param {string} typeOfParameter
   * @returns {Object} an error response object
   * @memberof ErrorMessages
   */
  static propertyTypeError(res) {
    return res.status(404).json({
      status: 404,
      error: 'No property with the specified type',
    });
  }
}

export default ErrorMessages;
