const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler =require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/productRoute");
const path = require("path");

const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173', // or your frontend domain
    credentials: true,
  })
);
//middle ware
app.use(express.json()); // ✅ Parses JSON
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // ✅ Parses form data

app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // To serve uploaded images



//route middleware
app.use("/api/users",userRoute);
app.use("/api/products", productRoute);
app.get('/',(req,res)=>{
    res.send("Home page")
});
//error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server running on port ${PORT}`);
            
        })
    })
    .catch((err)=>{console.log("error")})