import { asyncHandler } from "../util/asyncHandler.js"
import { apiError } from "../util/apiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../util/cloudinary.js";

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
})

export  { registerUser }