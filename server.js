const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const cors=require("cors");
const fileupload=require("express-fileupload")
const port=process.env.PORT;
const app=express();
app.use(express.urlencoded({extended:true}));
const url=process.env.MONGODBURL;
app.use(express.json());
app.use(cors());
app.use(fileupload({ createParentPath: true }));
mongoose.connect(url)

.then(()=>console.log("connection to mongodb "))
.catch((err)=>console.log("error connection to mongodb",err));

const usermodel=require("./router/userrouter");
app.use("/users",usermodel);

const employerouter =require("./router/employerouter");
app.use("/employe",employerouter)

const companierouter=require("./router/companierouter");
app.use("/companie",companierouter);

const jobsrouter=require("./router/jobsrouter");
app.use("/job",jobsrouter); 

const applicatonrouter=require("./router/applicatonrouter");
app.use("/application",applicatonrouter);

const candidaterouter=require("./router/candidaterouter");
app.use("/candidate",candidaterouter);
 
const postrouter = require("./router/postrouter")
app.use("/post",postrouter);

const fullinformationrouter=require("./router/fullinformationrouter");
app.use("/fullinfo",fullinformationrouter);

const commantrouter=require("./router/commantrouter");
app.use("/commant",commantrouter);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})