const GateSpace = require('../models/gateSpace.model');

module.exports = {
    async addDistanceBySpaceId(gateDistances, spaceId) {
        try {
            let request = [];
            gateDistances.forEach(async (gateDistance, index) => {
                request[index] = {
                    gateId: index+1,
                    spaceId,
                    distance: gateDistance
                }
            });
            console.log("GATE DISTANCE REQUEST" + JSON.stringify(request))
            await GateSpace.bulkCreate(request);
            return { message: "Gate space information created!"};
        }
        catch (error) {
            throw error;
        }
    }
}