import express from 'express';

const app = express();

const server = app.listen(process.env.port || 4000, () => {
  console.log('Now listening on port 4000');
});

module.exports = server;
