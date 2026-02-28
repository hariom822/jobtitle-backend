const express =require('express');
const router=express.Router();

const usercontroller=require('../controller/usercontroller');

router.post('/',usercontroller.adduser);
router.post('/send',usercontroller.sendmail);
router.post('/login',usercontroller.loginuser);
router.post("/theme", usercontroller.usertheme);
router.post("/reset",usercontroller.restpassword);
router.post("/forget",usercontroller.forgetpassword);
router.post("/otp",usercontroller.otp);
router.get("/all",usercontroller.alluser);
router.get("/oneuser/:id",usercontroller.oneuser);
router.post("/update/:id",usercontroller.updateuser);
router.delete("/delete/:id",usercontroller.deleteuser);                                             

module.exports=router;