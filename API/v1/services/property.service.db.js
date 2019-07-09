import _ from 'lodash';
import Db from '../Db/index';

/**
 * @exports PropertyService
 * @class PropertyService
 */
class PropertyService {
  /**
   * Handles the logic for listing a new property
   * @static
   * @param {Object} request request object
   * @returns {Object} object containing details of the newly listed property or an error object
   * @memberof PropertyService
   */
  static async postAProperty(request) {
    const { body, file, decoded } = request;

    const {
      state, city, price, type, address,
    } = body;

    const { id } = decoded.user;

    const status = 'Available';

    const query = 'INSERT INTO properties (owner, status, price, state, city, address, type, image_url, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *';

    const { rows } = await Db.query(query, [id, status, price, state, city,
      address, type, file.secure_url]);

    const response = _.pick(rows[0], ['id', 'status', 'type', 'state', 'city', 'address', 'price', 'created_on', 'image_url']);

    response.id = parseInt(response.id, 10);
    response.price = parseFloat(response.price);

    return response;
  }
}

export default PropertyService;
