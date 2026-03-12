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
    enum: ["admin", "employee", "candidate","companie"],
    default: "candidate"
  },
});
module.exports =mongoose.model('users',userSchema);