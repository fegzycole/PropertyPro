import express from 'express';
import Validation from '../middleware/validation';
import UserController from '../controller/user.controller';

const { createUserAccount } = UserController;

const { validateSignUpInput, checkForEmptyRequestParameters } = Validation;

const router = express.Router();

router.post('/signup', checkForEmptyRequestParameters, validateSignUpInput, createUserAccount);

export default router;
