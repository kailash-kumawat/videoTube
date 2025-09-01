import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCoudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get details from the frontend
  const { username, email, fullName, password } = req.body;
  // console.log(req.body);
  // validation - not empty
  if (
    [username, email, fullName, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  // check if user already exist or not.
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exist");
  }
  // check for images, avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  // upload them to cloudinary
  const avatar = await uploadOnCoudinary(avatarLocalPath);
  const coverImage = await uploadOnCoudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  // create user object - create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    password,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refreshtoken field from the response
  // check for user creation
  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered succesfully"));
});

export { registerUser };
