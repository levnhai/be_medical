const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');

function route(app) {
  app.use('/', homeRouter);
  app.use('/', newsRouter);
  app.use('/', categorynewsRouter);
}
module.exports = route;
