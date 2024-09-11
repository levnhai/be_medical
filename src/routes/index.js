const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');
const registrationRoutes = require('./registration');

function route(app) {
  app.use('/', homeRouter);
  app.use('/', newsRouter);
  app.use('/', categorynewsRouter);
  app.use('/', registrationRoutes);
}
module.exports = route;
