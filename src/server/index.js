const express = require('express');
const os = require('os');
const axios = require('axios');

const app = express();

app.use(express.static('dist'));


const getUsersList = async (paginationOffset) => {
  const url = `https://front-test.now.sh/users?offset=${paginationOffset}`;

  const response = await axios({
    method: 'get',
    url,
    headers: {
      'X-Auth-Token': '18476dc1c4fb11f4eebd2c4aaacdb3c14b3cd1e945dd8bc8456b73c8d4ef33cf'
    }
  });
  const users = response.data;

  return users;
};

app.get('/api/getUsername', (req, res) => res.send({
  username: os.userInfo().username
}));
app.get('/api/getUsersList', async (req, res) => {
  const {
    page
  } = req.query;
  const paginationOffset = `${String(page - 1)}0`;
  const usersList = await getUsersList(paginationOffset);
  res.send(usersList);
});

app.listen(8080, () => console.log('Listening on port 8080!'));
