class ErrorMessages {
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
      status: 'error',
      error: 'Email or password incorrect',
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
      status: 'error',
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
    if (typeOfParameter === 'id') error = 'Invalid id selected. A valid id is a number';
    if (typeOfParameter === 'status') error = 'Invalid status provided. You can only mark a property as \'Sold\'';
    res.status(status).json({
      status: 'error',
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
  static propertyNotFoundErrorResponse(res) {
    return res.status(404).json({
      status: 'error',
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
      status: 'error',
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
      status: 'error',
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
      status: 'error',
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
      status: 'error',
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
    let error;
    statusCode = 500;
    error = 'Internal Server Error';
    if (err.message === 'Authorization failed. Email or password incorrect') {
      error = err.message;
      statusCode = 401;
    }
    if (err.message === 'specify a new password to proceed' || err.message === 'specify your old password to proceed') {
      error = err.message;
      statusCode = 400;
    }
    if (err.message === 'New password must be at least 6 characters long' || err.message === 'The new password cannot be the same as the old one') {
      error = err.message;
      statusCode = 422;
    }
    if (err.message === 'Property with the provided id not found' || err.message === 'Email does not exist') {
      error = err.message;
      statusCode = 404;
    }
    if (err.message === 'Email already exists' || err.message === 'The password specified is not the same as what is saved in the database') {
      error = err.message;
      statusCode = 409;
    }
    if (err.message === 'You are not permitted to view this resource') {
      statusCode = 403;
      error = err.message;
    }
    return res.status(statusCode).json({
      status: 'error',
      error,
    });
  }
}

export default ErrorMessages;
