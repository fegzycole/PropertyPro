import _ from 'lodash';
import Db from '../Db/index';
import Helper from '../helper/helper';

const { generateQuery } = Helper;

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

    const response = _.pick(rows[0], ['id', 'status', 'type', 'state', 'city',
      'address', 'price', 'created_on', 'image_url']);

    response.id = parseInt(response.id, 10);
    response.price = parseFloat(response.price);

    return response;
  }

  /**
   * Handles the logic for updating a listed property
   * @static
   * @param {Object} request request object
   * @returns {Object} object containing details of the updated property or an error object
   * @memberof PropertyService
   */
  static async updateProperty(req) {
    const { params } = req;

    const arrayOfUpdateInputs = generateQuery(req);

    if (req.file) {
      arrayOfUpdateInputs[0].push('image_url');
      arrayOfUpdateInputs[1].push(req.file.secure_url);
    }

    const query = ['UPDATE properties SET '];

    const set = arrayOfUpdateInputs[0].map((key, i) => `${key} = ($${i + 1})`);

    query.push(`${set.join(', ')} WHERE id = ${parseInt(params.id, 10)} RETURNING *`);
    const finalQueryString = query.join(' ');

    const { rows } = await Db.query(finalQueryString, arrayOfUpdateInputs[1]);

    const response = _.pick(rows[0], ['id', 'owner', 'status', 'type', 'state', 'city', 'address',
      'price', 'created_on', 'image_url']);

    response.id = parseInt(response.id, 10);
    response.price = parseFloat(response.price);
    return response;
  }

  /**
   * Handles the logic for changing the status of a property to sold
   * @static
   * @param {Object} request request object
   * @returns {Object} object containing details of the updated property or an error object
   * @memberof PropertyService
   */
  static async updatePropertyStatus(req) {
    const { id } = req.params;
    const status = 'sold';
    const query = `UPDATE properties SET status = $1 WHERE id = ${parseInt(id, 10)} RETURNING *`;
    const { rows } = await Db.query(query, [status]);
    const response = _.pick(rows[0], ['id', 'owner', 'status', 'type', 'state', 'city', 'address',
      'price', 'created_on', 'image_url']);
    return response;
  }

  /**
   * Handles the Deleting of a listed property
   * @static
   * @param {Object} request request object
   * @returns {String||Object} string or an error object
   * @memberof PropertyService
   */
  static async deleteAProperty(req) {
    const { id } = req.params;
    const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
    const { rows } = await Db.query(query, [parseInt(id, 10)]);
    const response = 'Property deleted successfully';
    if (rows[0]) return response;
    throw new Error('Something went wrong, property could not be deleted');
  }
}

export default PropertyService;
