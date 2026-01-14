//wrapper function
const asyncHandler = (requestHandler) => async(req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
};

export { asyncHandler };