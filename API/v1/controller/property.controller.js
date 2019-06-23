import PropertyService from '../services/property.service';

const { postAProperty } = PropertyService;

class PropertyController {
  static postAProperty(req, res) {
    try {
      const result = postAProperty(req);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return res.json({
        status: 500,
        error,
      });
    }
  }
}

export default PropertyController;
