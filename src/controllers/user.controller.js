  import { asyncHandler as asynchandler } from '../utils/asynchandler.js';

const registerUser = asynchandler(async(req, res) => {
    res.status(200).json({
        message: "ok"
    }) // eplain what output we getafter this read about .status().json
})

export { registerUser }