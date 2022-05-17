const express = require('express');

const { authentication,
  validateAge,
  validateDate,
  validateName,
  validateRate,
  validateTalk } = require('../middlewares');

const { getTalkers, setTalker } = require('../utils/fs-utils');

const routes = express.Router();

routes.get('/search', authentication, async (req, res) => {
  try {
    const { q: name } = req.query;

    const talkers = await getTalkers();
    const filteredTalkers = talkers.filter((person) => person.name.includes(name));
    
    return res.status(200).json(filteredTalkers);
  } catch (err) {
    res.status(500).end();
  }
});

routes.get('/', async (req, res) => {
  try {
    const talkers = await getTalkers();
    return res.status(200).json(talkers);
  } catch (err) {
    console.error(`Não foi possível ler o arquivo. \n Erro: ${err}`);
    res.status(500).end();
  }
});

routes.get('/:id', async (req, res) => {
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

routes.delete('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await getTalkers();

    const talkersFiltered = talkers.filter((people) => people.id !== Number(id));

    await setTalker(talkersFiltered);
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
});

routes.use([authentication, validateName, validateAge, validateTalk, validateDate, validateRate]);

routes.post('/', async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    const oldTalkers = await getTalkers();

    const newTalker = {
      id: Math.max(...oldTalkers.map((talker) => talker.id)) + 1, 
      name,
      age,
      talk,
    };

    await setTalker([...oldTalkers, newTalker]);
    return res.status(201).json(newTalker);
  } catch (err) {
    res.status(500).end();
  }
});

routes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = await getTalkers();

    const talkerIndex = talkers.findIndex((r) => r.id === Number(id));
    if (talkerIndex === -1) return res.status(404).json({ message: 'Id não encotrado :/' });

    talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };

    await setTalker([...talkers, talkers[talkerIndex]]);

    return res.status(200).json(talkers[talkerIndex]);
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = routes;
