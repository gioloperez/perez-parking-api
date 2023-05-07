const express = require('express');
const router = express.Router();
const parkingService = require('../../services/parking.service');

router
    // COMPUTE RATES
    .post('/compute', async (req, res) => {
        try {
            let response = await parkingService.computeRate(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    })

module.exports = router;