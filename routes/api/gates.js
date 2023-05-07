const express = require('express');
const router = express.Router();
const gateService = require('../../services/gate.service');


router
    //GET GATES
    .get('/', async (req, res) => {
        try {
            let gates = await gateService.getGates();
            res.status(200).json(gates);
        } 
        catch (error) {
            res.status(500).json(error);
        }
    })
    // ADD NEW GATE
    .post('/', async (req, res) => {
        try {
            console.log("inserting: ", req.body)
            let response = await gateService.addGate(req.body);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    })

module.exports = router;