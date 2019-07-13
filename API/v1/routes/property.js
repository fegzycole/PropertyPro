import express from 'express';
import trimmer from 'express-body-trimmer';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import uploadAnImage from '../middleware/imageUpload';
import PropertyController from '../controller/property.controller';


const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
  getAllProperties, getPropertyByStatus,
  getPropertyById,
} = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, checkPropertyId,
  checkForInvalidUpdateParameters, checkStatusParameter,
} = Validation;

const {
  authenticateUser,
  checkContentType,
} = AuthenticateUser;

const router = express.Router();

router.post('/',
  authenticateUser,
  checkContentType,
  uploadAnImage,
  trimmer(),
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  postAProperty);

router.patch('/:id',
  authenticateUser,
  checkContentType,
  checkPropertyId,
  uploadAnImage,
  trimmer(),
  checkForInvalidUpdateParameters,
  updateProperty);

router.patch('/:id/sold',
  authenticateUser,
  checkPropertyId,
  checkStatusParameter,
  updatePropertyStatus);

router.delete('/:id',
  authenticateUser,
  checkPropertyId,
  deleteAProperty);

router.get('/',
  authenticateUser,
  getAllProperties);

router.get('/',
  getPropertyByStatus);

router.get('/:id',
  authenticateUser,
  checkPropertyId,
  getPropertyById);

export default router;
