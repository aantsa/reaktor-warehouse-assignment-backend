const mongoose = require('mongoose');


const AccessorieSchema = mongoose.Schema({
    id: String,
    type: String,
    name: String,
    color: [String],
    price: Number,
    manufacturer: String,
    availability: String
});



module.exports = mongoose.model('Accessorie', AccessorieSchema);
