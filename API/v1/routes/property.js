import express from 'express';
import AuthenticateUser from '../middleware/AuthenticateUser';
import Validation from '../middleware/validation';
import PropertyController from '../controller/property.controller';

const {
  postAProperty, updateProperty,
  updatePropertyStatus, deleteAProperty, getAllProperties,
} = PropertyController;

const {
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, uploadAnImage, checkPropertyId,
  checkForInvalidUpdateParameters, compareAgentsByEmail, checkStatusParameter,
} = Validation;

const { authenticateUser, authenticateAnAdmin } = AuthenticateUser;

const router = express.Router();

router.post('/', authenticateUser, authenticateAnAdmin, uploadAnImage,
  checkForEmptyPropertyPostParameters,
  validateCreatePropertyInput, postAProperty);

router.patch('/:id', authenticateUser, authenticateAnAdmin, checkPropertyId,
  compareAgentsByEmail, uploadAnImage,
  checkForInvalidUpdateParameters, updateProperty);

router.patch('/:id/sold', authenticateUser, authenticateAnAdmin, checkPropertyId,
  compareAgentsByEmail, checkStatusParameter, updatePropertyStatus);

router.delete('/:id', authenticateUser, authenticateAnAdmin, checkPropertyId, compareAgentsByEmail, deleteAProperty);

router.get('/:id', authenticateUser, checkPropertyId, getAllProperties);

export default router;
