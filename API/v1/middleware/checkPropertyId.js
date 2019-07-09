import _ from 'lodash';
import ErrorResponses from '../helper/error';
import Db from '../Db/index';

const { serverErrorMessage } = ErrorResponses;

const checkPropertyId = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM properties where id = $1';

    const { rows } = await Db.query(query, [parseInt(req.params.id, 10)]);

    if (!rows[0]) throw new Error('Property with the provided id not found');

    const owner = _.pick(rows[0], ['owner']);

    if (parseInt(req.decoded.user.id, 10) !== parseInt(owner.owner, 10)) {
      throw new Error('You are not permitted to view this resource');
    }

    return next();
  } catch (error) {
    return serverErrorMessage(error, res);
  }
};

export default checkPropertyId;
