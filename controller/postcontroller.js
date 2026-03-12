const postmodel = require("../model/postmodel");
const usermodel = require("../model/usermodel")
const uploadimg = require("../utility/cloudnary").uploadImage;
require("dotenv").config()
const nodemailer = require("nodemailer");
exports.addpost = async (req, res) => {
  try {

    let imageUrl = "";
    if (req.files && Object.keys(req.files).length > 0) {
      const fileObj = req.files;
      const imageResults = await uploadimg(fileObj);
      imageUrl = imageResults[0].url;
    }

    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const data = new postmodel({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      Image: imageUrl,
      tags: tags
    });

    await data.save();

    // 🔵 Tagged users ke emails nikalna
    const users = await usermodel.find(
      { _id: { $in: tags } },
      "email"
    );

    const emails = users.map(user => user.email);

    // 🔵 Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
      }
    });

    // 🔵 Mail send
    if (emails.length > 0) {
      await transporter.sendMail({
        from: process.env.USER_EMAIL,
        bcc: emails,   // 👈 sabko ek sath mail jayegi
        subject: "You were tagged in a post",
        html: `
        <h2>You were tagged in a post</h2>
        <p>You were tagged in the post:</p>
        <b>${data.title}</b>
        `
      });
    }

    res.status(200).json({
      message: "Post created successfully",
      post: data
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
};
exports.allpost = async (req,res)=>{

try{

const posts = await postmodel.find()
.populate("userId","name")
.populate({
path:"Comment",
populate:{
path:"userId",
select:"name"
}
})
.sort({createdAt:-1});

res.json(posts);

}catch(err){
res.status(500).json(err);
}

};
exports.onepost = async (req, res) => {
  try {

    const post = await postmodel
      .findById(req.params.id)

      // kis user ne post dali
      .populate("userId", "name email")

      // kis kis user ne like kiya
      .populate("likes", "name email")

      // comments + comment karne wala user
      .populate({
        path: "Comment",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};
exports.updatepost = async (req, res) => {
    try {
        const updatedpost = await postmodel.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true });
        if (!updatedpost) {
            return res.status(404).json({ error: 'post not found' });
        }
        res.status(200).json(updatedpost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};
exports.deletepost = async (req, res) => {
    try {
        const deletedpost = await postmodel.findByIdAndDelete(req.params.id);
        if (!deletedpost) {
            return res.status(404).json({ error: 'post not found' });
        }
        res.status(200).json({ message: 'post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};


exports.likePost = async (req, res) => {
  try {

    const postId = req.params.postId;
    const { userId } = req.body;

    const post = await postmodel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // check user already liked or not
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {

      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );

    } else {

      // like
      post.likes.push(userId);

    }

    await post.save();

    res.json({
      success: true,
      totalLikes: post.likes.length,
      likes: post.likes
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


exports.getUserPosts = async (req,res)=>{

try{

const userId = req.params.userId;

const posts = await postmodel.find({ userId:userId })

.populate("userId","name")

.populate("likes","name")

.populate({
path:"Comment",
populate:{
path:"userId",
select:"name"
}
})

.sort({createdAt:-1});

res.json(posts);

}catch(err){
res.status(500).json({message:err.message});
}

};
exports.addTag = async(req,res)=>{

try{

const {postId,userIds} = req.body;

const post = await postmodel.findByIdAndUpdate(
postId,
{
$addToSet:{
tags:{$each:userIds}
}
},
{new:true}
);

res.json(post);

}catch(err){
console.log(err);
}

};