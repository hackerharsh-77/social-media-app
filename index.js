const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const  helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")


const app = express();

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("connected to a mongdo db")
})

//middlewares

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)

app.get('/',(req,res)=>{
    res.send("welcome to home page")
})

app.get('/users',(req,res)=>{
    res.send("welcome to users page")
})



app.listen(8080, ()=>{
    console.log("server running on port 8080")
})