const express = require('express');
const bodyParser = require('body-parser');

const error = require('./middlewares/error');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const talkerRouter = require('./routers/talkerRouter');
const loginRouter = require('./routers/loginRouter');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send(); 
});

app.use('/talker', talkerRouter);
app.use('/login', loginRouter);

app.all('*', (req, res) => res.status(404).json({ message: `Rota '${req.path}' não existe!` }));

app.use(error);

app.listen(PORT, () => {
  console.log('Online');
});
