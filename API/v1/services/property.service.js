import propertyData from '../data/property.data';
import Property from '../model/property.model';

class PropertyService {
  static postAProperty(propertyDetails) {
    const { body, file } = propertyDetails;
    const {
      state, city, price, type, address,
    } = body;
    try {
      const id = propertyData.properties.length + 1;
      const createdOn = new Date();
      const status = 'Available';
      const owner = propertyDetails.decoded.user.id;
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
}

export default PropertyService;
