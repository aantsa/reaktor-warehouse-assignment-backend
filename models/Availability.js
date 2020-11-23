const mongoose = require('mongoose');

const AvailabilitySchema = mongoose.Schema({
    id: String,
    DATAPAYLOAD: String
});

module.exports = mongoose.model('Availability', AvailabilitySchema);