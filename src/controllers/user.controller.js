// importing the wraper for handling async part of code
import {asyncHandler} from "../utils/asyncHandler.js";

// importing the wraper for handling api error part of code
import { ApiError } from "../utils/ApiError.js";

// importing 
import { User } from "../models/user.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken"

// method to generate the access and refresh tokens
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findOne(userId)
        // console.log(user);
        
        
        const accessToken = await user.generateAccessToken()
        // console.log(accessToken);
        const refreshToken = await user.generateRefreshToken()
        // console.log(refreshToken);

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken , refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}


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

const loginUser = asyncHandler(async (req,res)=>{
    // login checking by email and password
    // ALGO
    // req.body -> data 
    // username or email
    // find user in db
    // password check
    // access and refresh tokens
    // send cookies 

    const { username , email , password } = req.body;
    if(!username  && !email ){throw new ApiError(400,"Empty fields not allowed")}

    // finding user on basis of username or email
    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user) {throw new ApiError(404, "User not found")}
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {throw new ApiError(401, "Passowrd not correct")}

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
    // console.log(accessToken);
    // console.log(refreshToken);
    

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    const options = {
        httpOnly: true,
        secure: false // set it back to true when deployment false helps in entertaining the http requests
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken , options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,accessToken,refreshToken
        },"user loggedIn successfully")
    )    
})

const logoutUser = asyncHandler( async (req,res)=>{
    // userId from auth middleware -> req.user._id
    // 
    const userId = req.user._id
    await User.findByIdAndUpdate(userId,{
        $set : {
            refreshToken: undefined
        }
    },
    {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: false // set it back to true when deployment false helps in entertaining the http requests
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,{},"User logged out succesfully"))

})

const refreshAccesstoken = asyncHandler(async (req,res)=>{
    try {
        const incommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
        if(!incommingRefreshToken){throw new ApiError(401,"Unauthorized request")}
    
        const decodedToken = jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure: false
        }
    
        const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,{accessToken , refreshToken: newRefreshToken},"Access token refreshed")
        )
    } catch (error) {
        throw new ApiError(500,error?.message || "invalid refresh token")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccesstoken

}