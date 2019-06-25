import PropertyService from '../services/property.service';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
  getAllProperties, getPropertiesByStatus,
  getPropertyById,
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

  static getAllProperties(req, res, next) {
    const { type } = req.query;
    if (type) {
      return next();
    }
    const result = getAllProperties();

    return res.status(200).json({
      status: 'success',
      data: [
        result,
      ],
    });
  }

  static getPropertyByStatus(req, res) {
    const result = getPropertiesByStatus(req);
    if (result) {
      return res.status(200).json({
        status: 'success',
        data: [
          result,
        ],
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No property with the specified type',
    });
  }

  static getPropertyById(req, res) {
    const result = getPropertyById(req);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
}

export default PropertyController;
