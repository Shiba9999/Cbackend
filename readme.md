1. entry point app.js as in package.json file i rename start tag as nodemon app.js

# app.js file

* app.use is a middleware and it take 2 input one is route and other is a cb
* db connection function call this in app.js file 

# db .js file

*  dotenv and mongoose import
 * How to create a connection between mongoose and express
 1.  open mongodb compass start connection rename localhost as
 127.0.0.1:27017 for node version 18 and above 
 then create a db collection and name it as u r convinience 
 and add that db collection name after the 127.0.0.1:27017
 so the final connection mongodb url will be as described in .env file 
 mongodb://127.0.0.1:27017/SERVER
 here  SERVER  is my collection name 

 # users.model.js file

 * here we desribe the collection of server db schemas
 here i only create one users db 
 *  UserSchema.pre this is a pre defined mongo function so by this function we can do the work like what we want to do before saving the data into the db  here as i want to encrypt the password just before the saving into the db

 * UserSchema.methods.comparePassword  by this we can add our custom function into  userschema prototype but it only work on user instance meaning (only on perticular type user not on all the users) 
 ex here we want to compare password of a perticular user first find out the user u want to compare password and then use this function as 
 thatuser.comparePassworD() like this


* and also don't use arrow function in define prototype function in mongo db because they don't have this so always use function statement 

* const User = mongoose.model("User", UserSchema);     
  this line make a collection by using Userschema on name of User
# user.routes.js

here we define our routes 
like i made different routes for login register and updatepassword 

and here we can add middleware function to verify or for other works like i did in updatePassword , verifyJWT is a middleware function

* so here the link generate by using router concept in express as 
 app.use("/api/v1/users",userRouter)
 
* http://localhost:8000//api/v1/users/then the routes defind in userRouter
  like for register 
  http://localhost:8000/api/v1/users/register and the get post delete method is defind so on

# user.controller.js


# registerUser
in controller normally all the function are defind in express

for signup or register first check wheather the user already exist or not 
for that findOne is the mongo function and  $or: [{ username }, { email }],
this $or also check as username or email exist in the db

* then create this function create a new user collection


# loginUser function

first check the user 
then compare the password using prototype function of UserSchema 
also generate Accesstoken is a prototypefunction

 * generateAccessToken

  UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

this function generate jwt token it take 3 arguments 
* payload data , secrate Token (self generated) , expiry time

when a user is login with right credentials then send him a token in a cookie while the next time user authenticate by the cookie that send to him cookie so while user want to change password or anything then we can verify based on his token data also in logout the concept is to remove the cookie 

# update password

1. first we check the cookie that is send to user while he logedin if the cookie is present then we extract the token for it 

2. then decode the token using token secret 
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
first one is the token extracted from cookie then the secret only the unique secret can decode the token



