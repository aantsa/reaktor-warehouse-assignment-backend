const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv/config');
require('dotenv').config({ path: 'ENV_FILENAME' });

//Middlewares
app.use(allowCrossDomain);
app.use(bodyParser.json());

var allowCrossDomain = function() {
    var cors_api_host = 'reaktor-warehouse-backend.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
}();

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
