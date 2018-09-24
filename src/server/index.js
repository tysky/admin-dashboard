const express = require('express');
const os = require('os');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('mz/fs');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());
app.use(fileUpload());

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


const getUserCustomData = async (userId) => {
  const defaultData = {
    imageUrl: 'defaultImage.png',
    description: "User hasn't description yet."
  };
  const options = { encoding: 'utf-8', flag: 'a+' };
  const usersData = await fs.readFile(`${__dirname}/users.json`, options);
  if (usersData.length === 0) {
    return defaultData;
  }
  return JSON.parse(usersData)[userId] || defaultData;
};

const getUserInfo = async (userId) => {
  const url = `https://front-test.now.sh/users/${userId}`;

  const userServerData = await axios({
    method: 'get',
    url,
    headers: {
      'X-Auth-Token': '18476dc1c4fb11f4eebd2c4aaacdb3c14b3cd1e945dd8bc8456b73c8d4ef33cf'
    }
  });
  const userCustomData = await getUserCustomData(userId);
  const userInfo = { ...userServerData.data.data, ...userCustomData };
  return userInfo;
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

app.get('/api/getUserInfo', async (req, res) => {
  const { userId } = req.query;
  console.log('getUserInfo', userId);
  const userInfo = await getUserInfo(userId);
  res.send(userInfo);
});

app.post('/api/setUserDescription', async (req, res) => {
  const { userId, description } = req.body;

  const options = { encoding: 'utf-8', flag: 'a+' };
  const fileData = await fs.readFile(`${__dirname}/users.json`, options);
  const usersData = fileData.length === 0 ? {} : JSON.parse(fileData);
  const newUsersData = { ...usersData, ...{ [userId]: { description } } };
  await fs.writeFile(`${__dirname}/users.json`, JSON.stringify(newUsersData));
  res.status(200).send('Description edited');
});

app.get('/api/userImage/:image', (req, res) => {
  res.sendFile(`${__dirname}/images/${req.params.image}`);
});

app.post('/api/uploadImage', (req, res) => {
  if (!req.files) { return res.status(400).send('No files were uploaded.'); }
  const image = Object.keys(req.files)[0];
  const imageFile = req.files[image];
  const filePath = `${__dirname}/images/${image}${path.extname(imageFile.name)}`;
  const parentPath = path.dirname(filePath);
  if (!fs.existsSync(parentPath)) {
    fs.mkdirSync(parentPath);
  }
  imageFile.mv(filePath, (err) => {
    if (err) { return res.status(500).send(err); }
    return res.send('File uploaded!');
  });
});

app.listen(8080, () => console.log('Listening on port 8080!'));
