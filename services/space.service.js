const Space = require('../models/space.model');

module.exports = {
    async addSpace(body) {
        try {
            await Space.create(body);
            return { message: "New parking space created!"};
        }
        catch (error) {
            throw error;
        }
    },

    async getSpaces() {
        try {
            let spaces = await Space.findAll();
            return spaces;
        }
        catch (error) {
            throw error;
        }
    }
}