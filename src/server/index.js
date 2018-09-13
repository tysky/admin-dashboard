const express = require('express');
const os = require('os');
const axios = require('axios');

const app = express();

app.use(express.static('dist'));


const getUsersList = async () => {
  const url = 'https://front-test.now.sh/users';

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
  const usersList = await getUsersList();
  res.send(usersList);
});

app.listen(8080, () => console.log('Listening on port 8080!'));
