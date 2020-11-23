const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv/config');
require('dotenv').config({ path: 'ENV_FILENAME' });

//Middlewares
app.use(cors());
app.use(allowCrossDomain);
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

//Import Routes
const jacketsRoute = require('./routes/jackets');
const shirtsRoute = require('./routes/shirts');
const accessoriesRoute = require('./routes/accessories');
const availabilitiesRoute = require('./routes/availabilities');

app.use('/api/products/jackets/', jacketsRoute);
app.use('/api/products/shirts/', shirtsRoute);
app.use('/api/products/accessories/', accessoriesRoute);
app.use('/api/availabilities/', availabilitiesRoute);


//ROUTES
app.get('/', (req,res) => {
    res.send('We are on home!');
});

//Connect To DB
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to DB!'));

//Start listening the server
app.listen(port);
