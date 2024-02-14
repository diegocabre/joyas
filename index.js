const express = require('express');
const app = express();
const router = require('./routes/joyas');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
