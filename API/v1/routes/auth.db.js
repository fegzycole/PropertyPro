import express from 'express';
import UserController from '../controller/user.controller.db';
import Validation from '../middleware/validation';
import checkExixtingEmail from '../middleware/checkExistingemail';

const router = express.Router();

const { createUser, loginUser } = UserController;

const {
  validateSignUpInput,
  checkForEmptyRequestParameters,
  checkForEmptySignInParameters,
} = Validation;

router.post('/signup',
  checkForEmptyRequestParameters,
  validateSignUpInput,
  checkExixtingEmail,
  createUser);

router.post('/signin',
  checkForEmptySignInParameters,
  loginUser);

export default router;
