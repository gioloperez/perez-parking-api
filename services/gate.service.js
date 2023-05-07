const Gate = require('../models/gate.model');

module.exports = {
    async addGate(body) {
        try {
            await Gate.create(body);
            return { message: "New gate created!"};
        }
        catch (error) {
            throw error;
        }
    },

    async getGates() {
        try {
            let gates = await Gate.findAll();
            return gates;
        }
        catch (error) {
            throw error;
        }
    }
}