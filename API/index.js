import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome To PropertyPro',
}));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
