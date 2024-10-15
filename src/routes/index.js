const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');
const registrationRoutes = require('./registration');
const bookingRoutes = require('./booking');
const authRoutes = require('./auth');

function route(app) {
  app.use('/', homeRouter);
  app.use('/auth', authRoutes);
  app.use('/news', newsRouter);
  app.use('/categorynews', categorynewsRouter);
  app.use('/registrations', registrationRoutes);
  app.use('/bookings', bookingRoutes);
  app.use('/', authRoutes);
}
module.exports = route;
