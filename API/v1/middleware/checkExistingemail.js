import ErrorResponses from '../helper/error';
import Db from '../Db/index';

const { serverErrorMessage } = ErrorResponses;

const checkExistingEmail = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM users where email = $1';
    const { rows } = await Db.query(query, [req.body.email]);
    if (rows[0]) throw new Error('Email already exists');
    return next();
  } catch (error) {
    return serverErrorMessage(error, res);
  }
};

export default checkExistingEmail;
