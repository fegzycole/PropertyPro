import express from 'express';
import trimmer from 'express-body-trimmer';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import uploadAnImage from '../middleware/imageUpload';
import PropertyController from '../controller/property.controller.db';

const {
  postAProperty,
  updateProperty,
  updatePropertyStatus,
  deleteAProperty,
  getAllProperties,
  getPropertyByStatus,
  getPropertyById,
} = PropertyController;

const {
  authenticateUser,
  checkContentType,
  checkPropertyId,
} = AuthenticateUser;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  checkForInvalidUpdateParameters,
  validateId,
} = Validation;

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
  validateId,
  checkPropertyId,
  uploadAnImage,
  trimmer(),
  checkForInvalidUpdateParameters,
  updateProperty);

router.patch('/:id/sold',
  authenticateUser,
  checkPropertyId,
  validateId,
  updatePropertyStatus);

router.delete('/:id',
  authenticateUser,
  validateId,
  checkPropertyId,
  deleteAProperty);

router.get('/',
  authenticateUser,
  getAllProperties);

router.get('/',
  getPropertyByStatus);

router.get('/:id',
  authenticateUser,
  validateId,
  checkPropertyId,
  getPropertyById);

export default router;