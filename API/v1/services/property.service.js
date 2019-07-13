/* eslint-disable camelcase */
import propertyData from '../data/property.data';
import Property from '../model/property.model';
import Helper from '../helper/helper';

const { checkId, getProperties } = Helper;
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
  static postAProperty(request) {
    const { body, file } = request;

    const {
      state, city, price, type, address,
    } = body;

    const id = propertyData.properties.length + 1;

    const created_on = new Date();

    const status = 'Available';

    const owner = request.decoded.user.id;

    const newProperty = new Property(id, owner, status,
      price, state, city, address, type, created_on, file);

    propertyData.properties.push(newProperty);

    const res = {
      id,
      status,
      type,
      state,
      city,
      address,
      price: parseFloat(price),
      created_on,
      image_url: file.secure_url,
    };

    return res;
  }

  /**
   * Handles the logic for updating a listed property
   * @static
   * @param {Object} request request object
   * @returns {Object} object containing details of the updated property or an error object
   * @memberof PropertyService
   */
  static updateProperty(request) {
    const { id } = request.params;

    const {
      type, price, state, city, address,
    } = request.body;

    const resultingProperty = checkId(parseInt(id, 10));
    if (type) resultingProperty.type = type;

    if (price) resultingProperty.price = parseFloat(price, 10);

    if (state) resultingProperty.state = state;

    if (city) resultingProperty.city = city;

    if (address) resultingProperty.address = address;

    if (request.file) resultingProperty.image_url = request.file.secure_url;

    return resultingProperty;
  }

  /**
   * Handles the logic for changing the status of a property to sold
   * @static
   * @param {Object} request request object
   * @returns {Object} object containing details of the updated property or an error object
   * @memberof PropertyService
   */
  static updatePropertyStatus(request) {
    const { id } = request.params;

    const { status } = request.body;
    const resultingProperty = checkId(parseInt(id, 10));

    resultingProperty.status = status;

    return resultingProperty;
  }

  /**
   * Handles the Deleting of a listed property
   * @static
   * @param {Object} request request object
   * @returns {String||Object} string or an error object
   * @memberof PropertyService
   */
  static deleteAProperty(request) {
    const { id } = request.params;
    const resultingProperty = checkId(parseInt(id, 10));
    const index = propertyData.properties.indexOf(resultingProperty);
    propertyData.properties.splice(index, 1);
    const successMessage = 'Property deleted successfully';
    return successMessage;
  }

  /**
   * Handles the Getting Of all Properties based on their status
   * @static
   * @param {Object} request request object
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static getPropertiesByStatus(req) {
    const { type } = req.query;
    const propertyInfo = propertyData.properties.filter(el => el.type === type);
    if (propertyInfo.length > 0) {
      const result = getProperties(propertyInfo);
      return result;
    }
    return false;
  }

  /**
   * Handles the Getting Of all Properties
   * @static
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static getAllProperties() {
    const propertyInfo = propertyData.properties.map(el => el);
    const result = getProperties(propertyInfo);
    return result;
  }

  /**
   * Handles the Getting Of a specific property based on its Id
   * @static
   * @param {Object} request request object
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static getPropertyById(req) {
    const { id } = req.params;
    const newArray = [];

    const propertyInfo = propertyData.properties.find(el => el.id === parseInt(id, 10));

    newArray.push(propertyInfo);

    const result = getProperties(newArray);

    return result;
  }
}

export default PropertyService;
