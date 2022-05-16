const fs = require('fs').promises;

const talkerFile = './talker.json';

const getTalkers = async () => {
  const fileContent = await fs.readFile(talkerFile, 'utf-8');
  return JSON.parse(fileContent);
};

module.exports = { getTalkers };
