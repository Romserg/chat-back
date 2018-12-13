const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const auth = require('./routes/authRoutes');
const cors = require('cors');

const app = express();

app.use(cors());

const dbConfig = require('./config/secret');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Methods',
        'GET',
        'POST',
        'DELETE',
        'PUT',
        'OPTIONS'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    );
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(logger('dev'));
app.use('/api/chat', auth);

mongoose.Promise = global.Promise;
mongoose.connect(
    dbConfig.url,
    { useNewUrlParser: true }
);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});