import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import auth from './v1/routes/auth';

const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/auth', auth);


app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To PropertyPro',
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
