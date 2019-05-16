import config from 'config';
import express from 'express';
import parser from 'body-parser';
import routes from './api-routes/user-routes';

const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

// allows access to body of the request
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// use User routes
app.use('/api/v1', routes);


app.listen(process.env.port || 4000, () => {
  console.log('now listening on port 4000');
});

module.exports = app;
