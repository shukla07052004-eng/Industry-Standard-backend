import { asyncHandler as asynchandler } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

const registerUser = asynchandler(async(req, res) => {
    // res.status(200).json({
    //    message: "ok"
    //}) // eplain what output we getafter this read about .status().json


    const {fullname, email, username, password} = req.body
    console.log("email: ", email);


    //checking each array one by one
    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }

    if(
        [fullname, email, username, password].some((field) => {field?.trim() === ""})
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ email },{ username }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }
})

export { registerUser }