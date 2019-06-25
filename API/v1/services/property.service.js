import propertyData from '../data/property.data';
import Property from '../model/property.model';
import Helper from '../helper/helper';

const { checkId, getProperties } = Helper;

class PropertyService {
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

  static getAllProperties() {
    try {
      const propertyInfo = propertyData.properties.map(el => el);
      const result = getProperties(propertyInfo);
      return result;
    } catch (error) {
      return error;
    }
  }
}

export default PropertyService;
