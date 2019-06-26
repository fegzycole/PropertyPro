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

    try {
      const id = propertyData.properties.length + 1;

      const createdOn = new Date();

      const status = 'Available';

      const owner = request.decoded.user.id;

      const newProperty = new Property(id, owner, status,
        price, state, city, address, type, createdOn, file);

      propertyData.properties.push(newProperty);

      const res = {
        id,
        status,
        type,
        state,
        city,
        address,
        price: parseFloat(price),
        createdOn,
        imageUrl: file.secure_url,
      };

      return res;
    } catch (error) {
      return error;
    }
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

    try {
      const resultingProperty = checkId(parseInt(id, 10));
      if (type) resultingProperty.type = type;

      if (price) resultingProperty.price = parseFloat(price, 10);

      if (state) resultingProperty.state = state;

      if (city) resultingProperty.city = city;

      if (address) resultingProperty.address = address;

      if (request.file) resultingProperty.imageUrl = request.file.secure_url;

      return resultingProperty;
    } catch (error) {
      return error;
    }
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
    try {
      const resultingProperty = checkId(parseInt(id, 10));

      resultingProperty.status = status;

      return resultingProperty;
    } catch (error) {
      return error;
    }
  }

  /**
   * Handles the Deleting of a listed property
   * @static
   * @param {Object} request request object
   * @returns {String||Object} string or an error object
   * @memberof PropertyService
   */
  static deleteAProperty(request) {
    try {
      const { id } = request.params;
      const resultingProperty = checkId(parseInt(id, 10));
      const index = propertyData.properties.indexOf(resultingProperty);
      propertyData.properties.splice(index, 1);
      const successMessage = 'Property deleted successfully';
      return successMessage;
    } catch (error) {
      return error;
    }
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
    const validStatus = ['2 Bedroom', '3 Bedroom', 'Land', 'Semi-detached duplex'];
    try {
      if (!validStatus.includes(type)) return false;

      const propertyInfo = propertyData.properties.filter(el => el.type === type);

      const result = getProperties(propertyInfo);
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   * Handles the Getting Of all Properties
   * @static
   * @returns {(Array|Object)} array or an error object
   * @memberof PropertyService
   */
  static getAllProperties() {
    try {
      const propertyInfo = propertyData.properties.map(el => el);
      const result = getProperties(propertyInfo);
      return result;
    } catch (error) {
      return error;
    }
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
    try {
      const newArray = [];

      const propertyInfo = propertyData.properties.find(el => el.id === parseInt(id, 10));

      newArray.push(propertyInfo);

      const result = getProperties(newArray);

      return result;
    } catch (error) {
      return error;
    }
  }
}

export default PropertyService;
