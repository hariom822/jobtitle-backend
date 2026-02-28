const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        required:true
    },
    theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
  role:{
    type:String,
    enum: ["admin", "employer", "candidate"],
    default: "candidate"
  },
});
module.exports =mongoose.model('User',userSchema);