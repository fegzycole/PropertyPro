import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import trimmer from 'express-body-trimmer';
import auth from './v1/routes/auth';
import authv2 from './v1/routes/auth.db';
import property from './v1/routes/property';
import propertyv2 from './v1/routes/property.db';

const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(trimmer());

// Routes
app.use('/api/v1/auth', authv2);
app.use('/api/v1/property', propertyv2);
app.use('/api/v2/auth', auth);
app.use('/api/v2/property', property);


app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To PropertyPro',
}));

app.use((req, res, next) => {
  const error = new Error('You are trying to access a wrong Route');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 400);
  res.json({
    status: 'error',
    error: error.message,
  });
  next();
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

export default app;
