const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { port } = require('./config/config');

//db config
const db = require('./config/config').mongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(err => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send('Hi app');
});

// //use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});