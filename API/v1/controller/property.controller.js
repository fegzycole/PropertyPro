import PropertyService from '../services/property.service';

const { postAProperty, updateProperty, updatePropertyStatus } = PropertyService;

class PropertyController {
  static postAProperty(req, res) {
    const result = postAProperty(req);
    if (result) {
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Request Unsuccessful, try again',
    });
  }

  static updateProperty(req, res) {
    const result = updateProperty(req);
    if (result) {
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Something went wrong, try again',
    });
  }

  static updatePropertyStatus(req, res) {
    const result = updatePropertyStatus(req);
    if (result) {
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Something went wrong, try again',
    });
  }
}

export default PropertyController;
