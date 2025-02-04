const express = require('express');
const axios = require('axios');
const app = express();

app.use('/proxy', async (req, res) => {
  const apiResponse = await axios.post('https://api.sparxreader.com/sparx.reading.users.v1.Sessions/StreamUserEvents', req.body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_API_TOKEN',
    },
  });
  res.json(apiResponse.data);
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));
