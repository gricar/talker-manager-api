module.exports = (req, res, next) => {
  const { body } = req;
  const { talk } = body;

  if (Object.keys(body).length !== 3 || Object.keys(talk).length !== 2) {
    return res
    .status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }

  next();
};
