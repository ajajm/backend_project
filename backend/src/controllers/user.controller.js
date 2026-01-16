import { asyncHandler } from "../util/asyncHandler.js"
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../util/cloudinary.js";


const generateAccesAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken    //save access token in db
      await user.save({ validateBeforeSave: false }) //no validation before save

      return {accessToken, refreshToken}

   } catch (error) {
      throw new apiError(500, "Something went wrong while generating refresh & access token")
   }
}

const registerUser = asyncHandler( async (req, res) => {
   //get user detail from frontend
   //validation & unique emailaddress
   //check if user already exist : username
   //check if files are uploaded : image, avatar
   //upload it to cloudinary: avatar
   //create user object - create entry in db
   //remove password & refresh token field
   //check for user creation
   //return res

   //user detail from frontend
   const {fullName, email, username, password} = req.body
   console.log("DETAILS:", fullName,email,username,password);  

   //validation & unique emailaddress
   if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new apiError(400, "All fileds are required")
   }

   //check if user already exist : username
   const existedUser = await User.findOne({
      $or: [{username}, {email}]
   })

   if (existedUser) {
      throw new apiError(409, "User with email or username already exists")
   }

   //check if files are uploaded : image, avatar
   const avatarLocalPath = req.files?.avatar[0]?.path; 
   const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
   if(!avatarLocalPath) {
      throw new apiError(400, "Avatar file is required")
   }

   //upload it to cloudinary: avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new apiError(400, "Avatar file not uploaded")
      console.log("Please reupload the file."); //debug
   }

   //create user object - create entry in db
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username : username.toLowerCase()
   })
   
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"     //this fields are not selected
   )
   
   if (!createdUser) {
      throw new apiError(500, "Something went wrong while registering user")
   }

   return res.status(201).json(
      new apiResponse(200, createdUser, "User created successfully!")
   )
})

const loginUser = asyncHandler( async (req, res) => {
   //req body
   //username or email based login
   //find the user in th db
   //access and refresh token
   //send cookie

   const {username, email, password} = req.body

   if (!email) {
      throw new apiError(400, "Username or email is required")
   }

   //find the user (username or email)
   const user = await User.findOne({
      $or: [{username}, {email}]
   })

   if (!user) {
      throw new apiError(404, "User does not exist")
   }
   
   //is password is correct
   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      throw new apiError(401, "Invalid user credentials")
   }

   //access and refresh token
   const {accessToken, refreshToken} = await generateAccesAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   //send it as cookie
   const options = {
      httpOnly: true,      //can only modify at server, can't at frontend
      secure: true
   }

   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken. options)
   .json(
      new apiResponse(200, {
         user: loggedInUser, accessToken, refreshToken
      }, "User logged in Successfully")
   )

})

const logoutUser = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
      req.user._id, {
         $set: {
            refreshToken: undefined
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,      //can only modify at server, can't at frontend
      secure: true
   }

   return res.status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json( new apiError(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
   const incomingRefreshToken = req.cokkies.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
      throw new apiError(401, "Unauthorized request")
   }

   try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
   
      const user = await User.findById(decodedToken?._id)
   
      if (!user) {
         throw new apiError(401, "Invalid refresh token")
      }
   
      if (incomingRefreshToken !== user?.refreshToken) {
         throw new apiError(401, "Refresh token is expired or used")
      }
   
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken, newrefreshAccessToken} = await generateAccesAndRefreshTokens(user._id)
   
      return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshAccessToken, options)
      .json(
         new apiResponse(200, {accessToken, newrefreshAccessToken}, "Access token refreshed!")
      )
   
   } catch (error) {
      throw new apiError(401, error?.message || "Invalud refresh Token")
   }
})

export  { registerUser, loginUser, logoutUser, refreshAccessToken }