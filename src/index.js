const express = require('express');
const morgan = require('morgan');
const path = require('node:path');
const hbs = require('express-handlebars');
const route = require('./routes');
const db = require('./config/database');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { socketSetup } = require('./socket');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = 8080;

//HTTP logger
app.use(morgan('combined'));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// template engine
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs.engine({
    extname: '.hbs',
    helpers: {
      sumIndex: function (a, b) {
        return a + b;
      },
    },
  }),
);

// Sử dụng middleware CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);
// Static Folder
app.set('views', path.join(__dirname, 'resources', 'views'));

// static web
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// cookie
app.use(cookieParser());

// Setup WebSocket (Socket.io)
socketSetup(server);

// router init
// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });
server.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});

db.Connect();
route(app);
