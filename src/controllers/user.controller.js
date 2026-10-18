// importing the wraper for handling async part of code
import {asyncHandler} from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res ) =>{
    // get user data from frontend
    // validataion - not empty
    // check if user already exist: username , email
    // check for avatar(compulsary) and cover image
    // upload to cloudinary 
    // create user object - create entry in db
    // remove PASSWORD and REFRESH TOKEN field from response
    // check for user creation 
    // return response else return error
    

    const {fullname,email,username,password } = req.body

    // advanced js method of validation 
    if(
    [fullname, username,email,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // traditional method of validation
    // if(fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
    

    // checking Existing user 
    const existingUser = await User.findOne({
        $or: [{email} , {username}]
    })
    if(existingUser) {throw new ApiError(409 ,"User with credentials already exist" )}

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){ throw new ApiError(400,"local Avatar path is required")}

    // console.log("response from cloudinary avatar",avatarLocalPath,"\n");
    // console.log("response from cloudinary coverImage",coverImageLocalPath);
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    // console.log("response from cloudinary avatar",avatar,"\n");
    // console.log("response from cloudinary coverImage",coverImage);
    
    

    if (!avatar) {
        throw new ApiError(400,"Avatar is required")
    }
    
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){ throw new ApiError(500,"Something went wrong while logging in user")}

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User logged in sucessfully")
    )
} )

// const loginUser = asyncHandler(async (req,res)=>{
//     // login checking by email and password
//     // ALGO
//     // receive email and password from frontend 
//     // check user exist or not if not then redirect to register page 
//     // validate fields for empty opr not
//     // compare for the email and password from db
//     // if value match then redirect to home and if not then try again

//     User.isPassword
// })

export {
    registerUser,

}