const express = require('express');
const router = express.Router();
const parkingService = require('../../services/parking.service');
const helperUtility = require('../../utils/helper.util');

router
    //GET FREE PARKING SPACE
    .get('/', async (req, res) => {
        try {
            const gateId = parseInt(req.query.gateId);
            const vehicleSize = parseInt(req.query.vehicleSize);
            let gate = await parkingService.getFreeSpaces(gateId, vehicleSize);
            res.status(200).json(gate);
        }
        catch (error) {
            console.log(error);
            let errorResponse = helperUtility.catchErrorResponse(error);
            res.status(errorResponse.status).json(errorResponse.body);
        }
    })
    // PARK VEHICLE
    .post('/', async (req, res) => {
        try {
            let result = await parkingService.park(req.body);
            res.status(200).json(result);
        } 
        catch (error) {
            console.log(error);
            let errorResponse = helperUtility.catchErrorResponse(error);
            res.status(errorResponse.status).json(errorResponse.body);
        }
        
    })

module.exports = router;