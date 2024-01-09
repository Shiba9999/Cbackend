const express = require("express");
const app = express();
require('dotenv').config();
app.use(express.json());
const db=require("./config/db");
const User = require("./users.model");
const userRouter = require("./usesr.routes");

const port = process.env.PORT || 5000;

db()

app.use("/api/v1/users",userRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
