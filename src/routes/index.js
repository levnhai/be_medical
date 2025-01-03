const homeRouter = require('./home');
const newsRouter = require('./news');
const categorynewsRouter = require('./categorynews');
const registrationRoutes = require('./registration');
const bookingRoutes = require('./booking');
const doctorRoutes = require('./doctor');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const hospitalRoutes = require('./hospital');
const contactCollabRoutes = require('./contactCollab');
const specialtyRoutes = require('./specialty');
const scheduleRoutes = require('./schedule');
const recordRoutes = require('./record');
const paymentRoutes = require('./payment');

function route(app) {
  app.use('/', homeRouter);
  app.use('/news', newsRouter);
  app.use('/categorynews', categorynewsRouter);
  app.use('/registrations', registrationRoutes);
  app.use('/bookings', bookingRoutes);
  app.use('/doctor', doctorRoutes);
  app.use('/user', userRoutes);
  app.use('/hospital', hospitalRoutes);
  app.use('/contact', contactCollabRoutes);
  app.use('/specialty', specialtyRoutes);
  app.use('/schedule', scheduleRoutes);
  app.use('/auth', authRoutes);
  app.use('/record', recordRoutes);
  app.use('/payment', paymentRoutes);
}
module.exports = route;
