import PropertyService from '../services/property.service';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
} = PropertyService;

class PropertyController {
  static postAProperty(req, res) {
    const result = postAProperty(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  static updateProperty(req, res) {
    const result = updateProperty(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  static updatePropertyStatus(req, res) {
    const result = updatePropertyStatus(req);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  static deleteAProperty(req, res) {
    const result = deleteAProperty(req);
    res.status(200).json({
      status: 'success',
      data: {
        message: result,
      },
    });
  }
}

export default PropertyController;
