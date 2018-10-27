const express = require('express');
const app = express();

const { port } = require('./config/config');

app.get('/', (req, res) => {
    res.send('Hi nodejs app');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});