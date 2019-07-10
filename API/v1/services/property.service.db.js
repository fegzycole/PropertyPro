/* eslint-disable no-param-reassign */
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

  /**
   * Handles the Getting Of all Properties
   * @static
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static async getAllProperties() {
    const query = 'SELECT properties.id, properties.status, properties.type, properties.state, properties.city, properties.address, properties.price, properties.created_on, properties.image_url, users.phone_number, users.email FROM properties JOIN users ON users.id = properties.owner';

    const { rows } = await Db.query(query);

    rows.forEach((row) => {
      row.owner_email = row.email;

      row.id = parseInt(row.id, 10);

      row.price = parseFloat(row.price, 10);

      row.owner_phone_number = row.phone_number;

      delete row.email;
      delete row.phone_number;
    });
    return rows;
  }


  /**
   * Handles the Getting Of all Properties based on their status
   * @static
   * @param {Object} request request object
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static async getPropertiesByStatus(req) {
    const { type } = req.query;

    const validStatus = ['2 Bedroom', '3 Bedroom', 'Land', 'Semi-detached duplex'];

    if (!validStatus.includes(type)) return false;

    const query = 'SELECT properties.id, properties.status, properties.type, properties.state, properties.city, properties.address, properties.price, properties.created_on, properties.image_url, users.phone_number, users.email FROM properties JOIN users ON users.id = properties.owner WHERE properties.type = $1';

    const { rows } = await Db.query(query, [type]);

    rows.forEach((row) => {
      row.owner_email = row.email;

      row.id = parseInt(row.id, 10);

      row.price = parseFloat(row.price, 10);

      row.owner_phone_number = row.phone_number;

      delete row.email;
      delete row.phone_number;
    });
    return rows;
  }

  /**
   * Handles the Getting Of all Properties based on their status
   * @static
   * @param {Object} request request object
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static async getPropertyById(req) {
    const query = 'SELECT properties.id, properties.status, properties.type, properties.state, properties.city, properties.address, properties.price, properties.created_on, properties.image_url, users.phone_number, users.email FROM properties JOIN users ON users.id = properties.owner WHERE properties.id = $1';

    const { rows } = await Db.query(query, [req.params.id]);

    if (!rows[0]) throw new Error('Property with the provided id not found');

    rows[0].owner_email = rows[0].email;

    rows[0].id = parseInt(rows[0].id, 10);

    rows[0].price = parseFloat(rows[0].price, 10);

    rows[0].owner_phone_number = rows[0].phone_number;

    delete rows[0].email;

    delete rows[0].phone_number;

    return rows[0];
  }
}

export default PropertyService;
