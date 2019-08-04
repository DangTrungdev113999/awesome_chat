import express from 'express';
let app = express();

let hostname = 'localhost';
let port = '1999';

app.get('/helloworld', (req, res) => {
  res.send('<h1>Hello world</h1>');
})

app.listen(port, hostname, () => {
  console.log(`running on ${hostname}: ${port}`);
})
