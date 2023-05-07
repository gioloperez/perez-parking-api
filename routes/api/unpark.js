const express = require('express');
const router = express.Router();
const parkingService = require('../../services/parking.service');
const helperUtility = require('../../utils/helper.util');

router
    // UNPARK VEHICLE
    .post('/', async (req, res) => {
        try {
            let result = await parkingService.unpark(req.body);
            res.status(200).json(result);
        } 
        catch (error) {
            console.log(error);
            let errorResponse = helperUtility.catchErrorResponse(error);
            res.status(errorResponse.status).json(errorResponse.body);
        }
    })

module.exports = router;