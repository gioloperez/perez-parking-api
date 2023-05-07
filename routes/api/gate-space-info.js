const express = require('express');
const router = express.Router();
const gateSpaceService = require('../../services/gateSpace.service');


router
    // ADD NEW GATE SPACE INFO
    .post('/', async (req, res) => {
        try {
            console.log("inserting: ", req.body)
            let response = await gateSpaceService.addDistanceBySpaceId(req.body.gateDistances, req.body.spaceId);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    })

module.exports = router;