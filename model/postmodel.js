const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

description:{
type:String,
required:true
},

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"users",
required:true
},
likes:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"users"
}
],
Comment:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"commant"
}
],
createdAt:{
type:Date,
default:Date.now
},
Image:{
  type:String
},
tags:[
  {
  type:mongoose.Schema.Types.ObjectId,
  ref:"users"
}
]

});

module.exports = mongoose.model("post",postSchema);