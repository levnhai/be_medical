const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');
const registrationRoutes = require('./registration');
const bookingRoutes = require('./booking');
const docterRoutes = require('./docter');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const hospitalRoutes = require('./hospital');

function route(app) {
  app.use('/', homeRouter);
  app.use('/auth', authRoutes);
  app.use('/news', newsRouter);
  app.use('/categorynews', categorynewsRouter);
  app.use('/registrations', registrationRoutes);
  app.use('/bookings', bookingRoutes);
  app.use('/docter', docterRoutes);
  app.use('/user', userRoutes);
  app.use('/hospital', hospitalRoutes);
  app.use('/', authRoutes);
}
module.exports = route;
