require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const getAuth = () => {
  let apiTime = Math.floor(Date.now() / 1000);
  let sha1 = crypto.createHash('sha1');
  let hashData = process.env.API_KEY + process.env.API_SECRET + apiTime;
  sha1.update(hashData);
  const auth = sha1.digest('hex');

  return auth;
};

const getSearchResults = async (query) => {
  const encodedQuery = encodeURI(query);
  const url = `${process.env.API_URL}/api/1.0/search/byterm?q=${encodedQuery}`;
  console.log('URL: ', url);
  console.log('query: ', encodedQuery);
  let apiTime = Math.floor(Date.now() / 1000);

  let options = {
    method: 'GET',
    headers: {
      'X-Auth-Date': '' + apiTime,
      'X-Auth-Key': process.env.API_KEY,
      Authorization: getAuth(),
      'User-Agent': 'Podcast Directory/1.0',
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

const getPodcast = async (id) => {
  const url = `${process.env.API_URL}/api/1.0/podcasts/byfeedid?id=${id}`;

  let apiTime = Math.floor(Date.now() / 1000);

  let options = {
    method: 'GET',
    headers: {
      'X-Auth-Date': '' + apiTime,
      'X-Auth-Key': process.env.API_KEY,
      Authorization: getAuth(),
      'User-Agent': 'Podcast Directory/1.0',
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

const getEpisodes = async (id) => {
  const url = `${process.env.API_URL}/api/1.0/episodes/byfeedid?id=${id}`;

  let apiTime = Math.floor(Date.now() / 1000);

  let options = {
    method: 'GET',
    headers: {
      'X-Auth-Date': '' + apiTime,
      'X-Auth-Key': process.env.API_KEY,
      Authorization: getAuth(),
      'User-Agent': 'Podcast Directory/1.0',
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/search/:query', async (req, res) => {
  let query = req.params.query || '';
  let searchResults = await getSearchResults(query);
  res.json(searchResults);
});

app.get('/podcast/:id', async (req, res) => {
  let id = req.params.id;
  let podcast = await getPodcast(id);
  res.json(podcast);
});

app.get('/episodes/:id', async (req, res) => {
  let id = req.params.id;
  let episodes = await getEpisodes(id);
  res.json(episodes);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
