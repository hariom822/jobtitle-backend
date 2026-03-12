const express = require("express");
const router = express.Router();

const postcontroller=require("../controller/postcontroller")
const auth = require("../middleware/auth")

router.post("/add",postcontroller.addpost);
router.get('/all', postcontroller.allpost);
router.get('/one/:id', postcontroller.onepost);
router.post('/update/:id',postcontroller.updatepost);
router.delete('/delete/:id', postcontroller.deletepost);
router.post("/like/:postId", postcontroller.likePost);
router.post("/tag",postcontroller.addTag)
router.get("/user/:userId",postcontroller.getUserPosts);
module.exports=router