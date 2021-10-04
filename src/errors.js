const errors = [
    {
        http_key: 400,
        key: "BAD_REQUEST",
        message: "The request is invalid.",
    },
    {
        http_key: 404,
        key: "NOT_FOUND",
        message: "The requested endpoint was not found.",
    },
];

module.exports = {
    /**
     * Get an error object by either an http status code or an error key.
     * @param {string | number} errorKey The key to identify the error. Either http status code or error key.
     * @param {string | undefined } customMessage Override the error message to return custom one.
     * @returns Object containing error and message
     */
    getError(errorKey, customMessage = undefined) {
        if (isNaN(errorKey)) {
            for (let error of errors) {
                if (error.key == errorKey) {
                    return {
                        error: error.key,
                        message: customMessage ? customMessage : error.message,
                    };
                }
            }
            return null;
        } else {
            for (let error of errors) {
                console.log(error);
                if (error.http_key == errorKey) {
                    return {
                        error: error.key,
                        message: customMessage ? customMessage : error.message,
                    };
                }
            }
            return null;
        }
    },
    /**
     * Build response error object from error object returned from getError
     * @param {Express.Response} res Response object provided by express
     * @param {{error: string, message: string}} error Error object returned from getError
     * @returns Error object that can be returned as result
     */
    resError(res, error) {
        res.status(error.http_key ? error.http_key : 400).json({
            success: false,
            ...error,
        });
        return res;
    },
};
