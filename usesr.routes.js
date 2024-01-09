const { registerUser, loginUser,updatePassword, verifyJWT } = require("./user.controller");
const express=require("express");
const userRouter=express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/updatePassword").post( verifyJWT,updatePassword);

module.exports=userRouter;