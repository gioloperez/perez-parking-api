const Parking = require('../models/parking.model');
const Space = require('../models/space.model');
const Gate = require('../models/gate.model');
const GateSpace = require('../models/gateSpace.model');
const { Op } = require('sequelize');
const helperUtility = require('../utils/helper.util');
const constants = require('../config/constants');

module.exports = {
    async park(body) {
        try {
            // CHECK IF VEHICLE IS ALREADY PARKED
            let parkingCheck = await checkIfParked(body.plateNumber);
            if (parkingCheck) {
                throw helperUtility.createErrorResponse("Vehicle is already parked!", 400);
            }

            // REQUEST BODY HANDLING
            // Date format: yyyy-MM-ddThh:mm:ss
            let startDateFormat = new Date(body.startTime).toISOString();
            body.startTime = startDateFormat;

            body.isContinuous = await checkIfContinuous(body.plateNumber, body.startTime)

            // GET NEAREST FREE SPACE
            let gate = await this.getFreeSpaces(body.gateId, body.vehicleSize);
            body.spaceId = gate.gateSpaces[0].spaceId;

            // CREATE PARKING DATA
            let parking = await Parking.create(body);

            // OCCUPY SPACE
            await setIsOccupiedValue(body.spaceId, true);

            return { 
                message: `Vehicle with plate ${body.plateNumber} parked in space ${body.spaceId}!`,
                ticket: parking
            };
        }
        catch (error) {
            throw error;
        }
    },

    async unpark(body) {
        try {
            // REQUEST BODY HANDLING
            if(body.endTime && body.parkingId) {
                // Date format: yyyy-MM-ddThh:mm:ss
                let endTimeFormat = new Date(body.endTime).toISOString();
                body.endTime = endTimeFormat;
            }
            else {
                throw helperUtility.createErrorResponse("Please provide parking ID and end time!", 400);
            }
            
            // GET PARKING DATA
            let parking = await Parking.findOne({
                where: {
                    parkingId: body.parkingId
                },
                include: [{
                    model: Space
                }]
            });

            // VALIDATE END TIME
            if(parking.startTime >= body.endTime) {
                throw helperUtility.createErrorResponse("End time must not be earlier than start time!", 400);
            }
            parking.endTime = body.endTime;

            // COMPUTE RATE
            let computeObj = {
                isContinuous: parking.isContinuous,
                size: parking.space.size,
                startTime: parking.startTime,
                endTime: parking.endTime
            }
            let finalRate = await this.computeRate(computeObj);
            
            // UNPARK
            parking.space.isOccupied = false; 
            parking.exitRate = finalRate;
            await parking.save();
            await parking.space.save();

            return { 
                message: `Parking ID ${body.parkingId} unparked!`,
                ticket: parking
            };

        } 
        catch (error) {
            throw error;
        }
    },

    async getParkings() {
        try {
            let response = await Parking.findAll();
            return response;
        }
        catch (error) {
            throw error;
        }
    },

    async getFreeSpaces(gateId, vehicleSize) {
        //Get free spaces by gateId, ordered by distance
        try {
            let gate = await Gate.findOne({
                where: {
                    gateId
                },
                order: [
                    [{ model: GateSpace },'distance', 'asc']
                ],
                include: [
                    {
                        model: GateSpace,
                        where: {
                            gateId
                        },
                        include: [
                            {
                                model: Space,
                                where: {
                                    size: { [Op.gte]: vehicleSize},
                                    isOccupied: false,
                                }
                            }
                        ]
                    }
                ]
            })
            if(!gate) {
                throw helperUtility.createErrorResponse("No spaces available!", 400);
            }
            return gate;
        } 
        catch (error) {
            throw error;
        }
    },

    async computeRate(body) {
        let hourlyRate = 0;
        let finalRate = constants.flatRate;
        if (body.isContinuous) {
            finalRate = 0;
        }

        //DETERMINE HOURLY RATE
        switch(body.size) {
            case 0:
                hourlyRate = constants.smallHourlyRate;
                break;
            case 1:
                hourlyRate = constants.mediumHourlyRate;
                break;
            case 2:
                hourlyRate = constants.largeHourlyRate;
                break;
            default:
                throw helperUtility.createErrorResponse("Size not valid!", 400);
        }

        // GET TIME DIFFERENCE
        let timeDiff = getTimeDifference(body.startTime, body.endTime);
        
        // COMPUTE ADDITIONAL RATES IF EXCEEDED BASIC HOURS
        if (timeDiff > constants.basicHours || body.isContinuous) {
            let days = Math.floor(timeDiff / 24);
            let hours =  Math.ceil(timeDiff % 24);
            let chargedHours = 0;
            if(days > 0 || body.isContinuous) {
                chargedHours = hours;
            }
            else {
                chargedHours = hours - 3;
            }
            console.log("DAYS: " + days + " HOURS: " + hours);
            finalRate += (days * constants.dailyRate) + (chargedHours * hourlyRate);
        }

        return finalRate;
        
    }
}

async function setIsOccupiedValue(spaceId, bool) {
    let space = await Space.findByPk(spaceId);
    space.isOccupied = bool;
    await space.save();
}

function getTimeDifference(startTime, endTime) {
    let startTimeMil = new Date(startTime).valueOf();
    let endTimeMil = new Date(endTime).valueOf();
    let timeDiff = (endTimeMil - startTimeMil) / 1000 / 60 / 60;
    return timeDiff;
}

async function checkIfParked(plateNumber) {
    let parking = await Parking.findOne({
        where: {
            plateNumber,
            endTime: null
        }
    });
    return parking;
}

async function checkIfContinuous(plateNumber, newStartTime) {
    //CHECK IF VEHICLE PARKED BEFORE
    let parking = await Parking.findOne({
        where: {
            plateNumber
        },
        order: [
            ['endTime', 'DESC']
        ]
    });

    //GET TIME DIFFERENCE IF VEHICLE PARKED BEFORE
    if(parking) {
        let timeDiff = getTimeDifference(parking.endTime, newStartTime);
        if (timeDiff > constants.continuousHourThreshold) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
    
}
