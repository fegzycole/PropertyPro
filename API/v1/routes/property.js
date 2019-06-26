import express from 'express';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty,
  getAllProperties, getPropertyByStatus,
  getPropertyById,
} = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage, checkPropertyId,
  checkForInvalidUpdateParameters, compareAgentsById, checkStatusParameter,
} = Validation;

const {
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
} = AuthenticateUser;

const router = express.Router();

router.post('/',
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
  uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput,
  postAProperty);

router.patch('/:id',
  authenticateUser,
  authenticateAnAdmin,
  checkContentType,
  checkPropertyId,
  compareAgentsById,
  uploadAnImage,
  checkForInvalidUpdateParameters,
  updateProperty);

router.patch('/:id/sold',
  authenticateUser,
  authenticateAnAdmin,
  checkPropertyId,
  compareAgentsById,
  checkStatusParameter,
  updatePropertyStatus);

router.delete('/:id',
  authenticateUser,
  authenticateAnAdmin,
  checkPropertyId,
  compareAgentsById,
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
