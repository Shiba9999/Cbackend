const ApiError = require("./errorcode");
const User = require("./users.model");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    console.log("Headers",req.headers);
    // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader?.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
    if (!token) {
      throw new ApiError(401, "User not logged in");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decoded", decoded);
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};
const registerUser = async (req, res) => {
  const { username, email, fullName, password } = req.body;
  console.log(username, email, fullName, password);

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    fullName,
    password,
  });
  console.log(user);
  res
    .status(200)
    .json({ success: true, message: "Data received successfully" });
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!existedUser) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await existedUser.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = await existedUser.generateAccessToken();
  console.log("accesstoken", accessToken);
  const loggedInuser = await User.findById(existedUser._id);

  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("accessToken", accessToken, options);

// Set token in the "Authorization" header
  res.setHeader("Authorization", `Bearer ${accessToken}`);

  // return res.status(200).cookie("accessToken", accessToken, options).json({
  //   success: true,
  //   message: "User logged in successfully",
  //   user: loggedInuser,
  // });
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: loggedInuser,
  });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

module.exports = { registerUser, loginUser, updatePassword, verifyJWT };
