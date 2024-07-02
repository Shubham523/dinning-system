const express = require("express")
const app = express();
const morgan = require("morgan");

const cors = require("cors");
const dbPool = require("./config/database");

const userRoutes = require("./routes/user");
const dinningRoutes = require("./routes/dinningplacesRoutes");
const path = require('path')
const dotenv = require('dotenv')

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/",userRoutes)
app.use("/api/",dinningRoutes)

app.get("/",(req, res)=>{
    return res.status(200).json({
        message : "hello world"
    })
})
app.listen(process.env.PORT || 3000, (req, res) =>{
    dbPool.query(`select 1`).then(()=>{
        console.log("database connected");
    })
    .catch(error => console.log("database connection failed " ,error));
    console.log(`Server is running on port : ${process.env.PORT}`);
})