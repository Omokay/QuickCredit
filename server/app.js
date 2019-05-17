import express from 'express';
import parser from 'body-parser';
import routes from './api-routes/user-routes';

const app = express();

// allows access to body of the request
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// use User routes
app.use('/api/v1', routes);

// base route
app.get('/', (req, res) => res.status(200)
  .send({
    status: 200,
    message: 'Welcome to Quick Credit',
  }));
// all non-existent routes
app.all('*', (req, res) => res.status(404)
  .send({
    status: 404,
    error: 'Page not found',
  }));


app.listen(process.env.PORT || 4000, () => {
  console.log('now listening on port 4000');
});

module.exports = app;
