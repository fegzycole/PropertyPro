import express from 'express';
import UserController from '../controller/user.controller.db';
import Validation from '../middleware/validation';
import checkExistingEmail from '../middleware/checkExistingemail';

const router = express.Router();

const { createUser, loginUser, resetPassword } = UserController;

const {
  validateSignUpInput,
  checkForEmptySignInParameters,
  validateResetPassword,
  checkResetPasswordProperties,
} = Validation;

router.post('/signup',
  validateSignUpInput,
  checkExistingEmail,
  createUser);

router.post('/signin',
  checkForEmptySignInParameters,
  loginUser);

router.post('/:email/reset_password',
  checkResetPasswordProperties,
  validateResetPassword,
  checkExistingEmail,
  resetPassword);

export default router;
