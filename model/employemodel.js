const mongoose=require("mongoose")
const empdata= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
     phone:{
        type:String,
        required:false
    },
    password:{
        type:String,
    },
    salary:{
        type:String,
    },
    menttype:{
        type:String,
        required:false
    },
    pannumbert:{
        type:String,
        
    },
    joindate:{
        type:Date,
        default:Date.now
    },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  addherimage:{
    type:String
  },
  profileimage:{
    type:String
  },

})
module.exports=mongoose.model("employe",empdata);