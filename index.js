const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const { getTalkers } = require('./utils/fs-utils');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const authentication = require('./middlewares/authentication');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateDate = require('./middlewares/validateDate');
const validateRate = require('./middlewares/validateRate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send(); 
});

app.get('/talker', async (request, response) => {
  try {
    const talkers = await getTalkers();
    return response.status(200).json(talkers);
  } catch (err) {
    console.error(`Não foi possível ler o arquivo. \n Erro: ${err}`);
    response.status(500).end();
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const talkers = await getTalkers();
    const talker = talkers.find((person) => person.id === Number(id));

    if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    return res.status(200).json(talker);
  } catch (err) {
    res.status(500).end();
  }
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  return res.status(200).json({ token });
});

app.use([authentication, validateName, validateAge, validateTalk, validateDate, validateRate]);

app.post('/talker', (req, res) => {
  const { body } = req;

  res.status(201).json({ body });
});

app.all('*', (req, res) => res.status(404).json({ message: `Rota '${req.path}' não existe!` }));

app.listen(PORT, () => {
  console.log('Online');
});
