const _ = require('lodash');

module.exports = {

    createErrorResponse: function (errorName, errorStatus) {
        let err = new Error(errorName);
        err.status = errorStatus;
        err.message = errorName;
        return err;
    },
    catchErrorResponse: function (errorObject) {
        let errorResponse = {
            status: _.get(errorObject, 'status', undefined) || 500,
            body: errorObject.message ? { error: errorObject.message } : errorObject? { error: errorObject } : { error: "exception" }
        };
        return errorResponse;
    },

    queryParamsHandler: function (queries) {
        let response = {};
        Object.keys(queries).forEach(query => {
            response[query] = queries[query];
        })
        console.log("Handled response ", response);
        return response;
    }
}