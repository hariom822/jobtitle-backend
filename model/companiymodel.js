const mongoose = require("mongoose");
const companieSchema = new mongoose.Schema({
    companiename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    companydescription: {
        type: String
    },
    companyaddress: {
        type: String
    },
    website:{
         type:String
     },

     logo:{
       type:String
     },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
     },
     status:{
type:String,
enum:["pending","approved","rejected"],
default:"pending"
},

// Soft delete
isDeleted:{
type:Boolean,
default:false
},

createdAt:{
type:Date,
default:Date.now
}


});

module.exports = mongoose.model('companie', companieSchema);