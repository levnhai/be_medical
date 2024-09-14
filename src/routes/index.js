const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');
const registrationRoutes = require('./registration');
const bookingRoutes = require('./booking');

function route(app) {
  app.use('/', homeRouter);
  app.use('/news', newsRouter);
  app.use('/categorynews', categorynewsRouter);
  app.use('/registrations', registrationRoutes);
  app.use('/bookings', bookingRoutes);
}
module.exports = route;
