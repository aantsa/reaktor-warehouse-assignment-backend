const express = require('express');
const router = express.Router();
const Shirts = require('../models/Shirts');
const axios = require('axios');
const mongoose = require('mongoose');
const apiUrl = 'https://bad-api-assignment.reaktor.com';
const middle = '/products/';

//GET BACK ALL THE SHIRTS
router.get('/', async (req, res) => {
  try {
    const shirts = await Shirts.find();
    res.json(shirts);
  } catch (error) {
    res.json({message: 'Unable to get shirts data from the localhost'});
  }
});

//FETCH DATA FROM THE API
const shirtsData = async () => {
  let shirts = 'shirts';
    await axios.get(apiUrl + middle + shirts)
      .then((response) => onSuccess(response))
      .catch((error) => {
        throw new Error('Unable to get shirts data from the API');
      })
}

//ON SUCCESS, STORE DATA TO TEMP VARIABLES
const onSuccess = async (response) => {
  var array = response.data;
  var arrayLength = Object.keys(array).length;
  for (let i = 0; i < arrayLength; i++) {
    var id = array[i].id;
    var type = array[i].type;
    var name = array[i].name;
    var color = array[i].color;
    var price = array[i].price;
    var manufacturer = array[i].manufacturer;
    assignDataValue(id, type, name, color, price, manufacturer)
  }
}

//ASSINING VALUES
const assignDataValue = async (id, type, name, color, price, manufacturer) => {
  await Shirts.updateOne(
    {id: id},
    {type: type, name: name, color: color, price: price, manufacturer: manufacturer},
    {upsert : true}
  ), (error, result) => {
    if(error) {
      throw new Error('Unable to assing data values');
    }
  }
}


//FIND BY ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Shirts.find({id: req.params.productId})
    res.json(product);
  } catch (error) {
    res.json({
      message: "Unable to get product by id"
    });
  }
});

//FIND BY NAME
router.get('/:productName', async (req, res) => {
  try {
    const product = await Shirts.find({name: req.params.productId})
    res.json(product);
  } catch (error) {
    res.json({
      message: "Unable to get product by name"
    });
  }
});

shirtsData();
//setInterval(shirtsData, 300000)

/**
 * This interval is to be manually set by the customer.
 * It determines when will the data should be fetched from the api.
 */

module.exports = router;
