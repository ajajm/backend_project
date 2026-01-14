import { asyncHandler } from '../util/asyncHandler.js';

const loginUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "Backend project !! success"
    })
})


export { loginUser } 
