import ErrorResponses from '../helper/error';
import Db from '../Db/index';

const { serverErrorMessage } = ErrorResponses;

const checkExistingEmail = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM users where email = $1';
    if (req.body.email) {
      const { rows } = await Db.query(query, [req.body.email]);
      if (rows[0]) throw new Error('Email already exists');
    }
    if (req.params.email) {
      const { rows } = await Db.query(query, [req.params.email]);
      if (!rows[0]) throw new Error('Email does not exist');
    }
    return next();
  } catch (error) {
    return serverErrorMessage(error, res);
  }
};

export default checkExistingEmail;
