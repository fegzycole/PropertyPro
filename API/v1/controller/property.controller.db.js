import PropertyService from '../services/property.service.db';
import ErrorMessages from '../helper/error';

const { serverErrorMessage } = ErrorMessages;

const {
  postAProperty,
  updateProperty,
  updatePropertyStatus,
  deleteAProperty,
  getAllProperties,
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
  static async postAProperty(req, res) {
    try {
      const result = await postAProperty(req);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }

  /**
   * Updates specified parameters of a listed property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static async updateProperty(req, res) {
    try {
      const result = await updateProperty(req);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }


  /**
   * Updates the status of a listed property to sold
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static async updatePropertyStatus(req, res) {
    try {
      const result = await updatePropertyStatus(req);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }


  /**
   * Deletes a listed property
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static async deleteAProperty(req, res) {
    try {
      const result = await deleteAProperty(req);
      return res.status(200).json({
        status: 'success',
        data: {
          message: result,
        },
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }

  /**
   * Gets all listed properties from the database
   * @static
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response
   * @memberof PropertyController
   */
  static async getAllProperties(req, res, next) {
    try {
      const { type } = req.query;
      if (type) {
        return next();
      }
      const result = await getAllProperties();

      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return serverErrorMessage(error, res);
    }
  }
}

export default PropertyController;
