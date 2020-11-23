const express = require('express');
const router = express.Router();
const Availabilities = require('../models/Availability');
const axios = require('axios');
const mongoose = require('mongoose');
const apiUrl = 'https://bad-api-assignment.reaktor.com';
const middle = '/availability/';


//GET BACK ALL THE AVAILABILITIES
router.get('/', async (req, res) => {
  try {
    const availability = await Availabilities.find();
    res.json(availability);
  } catch (error) {
    res.json({message: 'Unable to get availability data from the localhost'});
  }
});

//FETCH DATA FROM THE API
const availabilityData = async () => {
  let params = [ 'xoon', 'reps', 'nouke', 'derp', 'abiplos' ]
    for (let i = 0; i < params.length; i++) {
    await axios.get(apiUrl + middle + params[i])
      .then((response) => onSuccess(response))
      .catch((error) => {
        throw new Error('Unable to get availability data from the API');
      })
    }
}

//ON SUCCESS, STORE DATA TO TEMP VARIABLES
const onSuccess = async (response) => {
  var reg = 'E>(.*)<\/I'
  var array = response.data.response;
  var arrayLength = Object.keys(array).length;
  for (let i = 0; i < arrayLength; i++) {
    var id = array[i].id;
    if(array[i].DATAPAYLOAD !== undefined){
      var DATAPAYLOAD = array[i].DATAPAYLOAD.match(reg)[1];
    }
    await assignAvailabilityValue(id, DATAPAYLOAD)
  }
}

//ASSINING VALUES
const assignAvailabilityValue = async (id, DATAPAYLOAD) => {
  await Availabilities.updateOne(
    {id: id},
    {DATAPAYLOAD: DATAPAYLOAD},
    {upsert : true}
  ), (error, result) => {
    if(error) {
      throw new Error('Unable to assing data values');
    }
  }
}

availabilityData();
// setInterval(availabilityData, 300000)

/**
 * This interval is to be manually set by the customer.
 * It determines when will the data should be fetched from the api.
 */
module.exports = router;
