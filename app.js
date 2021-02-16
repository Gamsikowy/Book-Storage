const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '.env' });

const app = express();

const indexRouter = require('./routes/index');

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/funcionality'));

mongoose.set('useFindAndModify', false);

const MongoURI = require('./config/keys').MongoURI;
mongoose.connect(MongoURI, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Mongoose connected'));

app.use('/', indexRouter);
app.use('/add', indexRouter);
app.use('/library', indexRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));