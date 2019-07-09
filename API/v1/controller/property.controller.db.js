import PropertyService from '../services/property.service.db';
import ErrorMessages from '../helper/error';

const { serverErrorMessage } = ErrorMessages;

const { postAProperty } = PropertyService;
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
}

export default PropertyController;
