import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome To PropertyPro',
}));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
