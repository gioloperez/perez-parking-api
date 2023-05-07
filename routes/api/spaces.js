const express = require('express');
const router = express.Router();
const spaceService = require('../../services/space.service');


router
    //GET ALL PARKING SPACES
    .get('/', async (req, res) => {
        try {
            let users = await spaceService.getSpaces();
            res.status(200).json(users);
        } 
        catch (error) {
            res.status(500).json(error);
        }
    })
    // ADD PARKING SPACE
    .post('/', async (req, res) => {
        try {
            console.log("inserting: ", req.body)
            let response = await spaceService.addSpace(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    })

module.exports = router;