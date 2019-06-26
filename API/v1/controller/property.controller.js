import PropertyService from '../services/property.service';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
  getAllProperties, getPropertiesByStatus,
  getPropertyById,
} = PropertyService;

/**
 *
 * @exports PropertyController
 * @class PropertyController
 */
class PropertyController {
  /**
   * Lists a New Property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static postAProperty(req, res) {
    const result = postAProperty(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  /**
   * Updates specified parameters of a listed property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static updateProperty(req, res) {
    const result = updateProperty(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  /**
   * Updates the status of a listed property to sold
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static updatePropertyStatus(req, res) {
    const result = updatePropertyStatus(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  /**
   * Deletes a listed property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static deleteAProperty(req, res) {
    const result = deleteAProperty(req);
    res.status(200).json({
      status: 'success',
      data: {
        message: result,
      },
    });
  }

  /**
   * Gets all listed properties from the database
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static getAllProperties(req, res, next) {
    const { type } = req.query;
    if (type) {
      return next();
    }
    const result = getAllProperties();

    return res.status(200).json({
      status: 'success',
      data: [
        result,
      ],
    });
  }

  /**
   * Gets all properties of a specified status
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response or an error response if no property was found
   * @memberof PropertyController
   */
  static getPropertyByStatus(req, res) {
    const result = getPropertiesByStatus(req);
    if (result) {
      return res.status(200).json({
        status: 'success',
        data: [
          result,
        ],
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No property with the specified type',
    });
  }

  /**
   * Gets a particular Property by its Id
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static getPropertyById(req, res) {
    const result = getPropertyById(req);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
}

export default PropertyController;
