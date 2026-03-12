const commantmodel=require("../model/commantmodel");
const Post = require("../model/postmodel");
exports.addcommant=async(req,res)=>{
    try {
        const data=new commantmodel(req.body);
    await data.save();
    return res.status(200).json({data})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

exports.allcommant=async(req,res)=>{
    try {
         const alldata=await commantmodel.find();
         return res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
   

}

exports.onecommant=async (req,res) => {
    try {
        const commant = await commantmodel.findById(req.params.id);   
        if (!commant) {
            return res.status(404).json({ error: 'commant not found' });
        }
        res.status(200).json(commant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch commant' });
    }
};
exports.updatecommant = async (req, res) => {
    try {
        const updatedCommant = await commantmodel.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true });
        if (!updatedCommant) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json(updatedCommant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update companie' });
    }
};
exports.deletecommant = async (req, res) => {
try {

const commentId = req.params.id;

// comment find karo
const comment = await commantmodel.findById(commentId);

if (!comment) {
return res.status(404).json({ message: "Comment not found" });
}

// post se comment remove karo
await Post.findByIdAndUpdate(
comment.postId,
{ $pull: { Comment: commentId } }
);

// comment delete karo
await commantmodel.findByIdAndDelete(commentId);

res.status(200).json({
message: "Comment deleted successfully"
});

} catch (error) {

res.status(500).json({
error: "Failed to delete comment"
});

}
};
exports.addComment = async (req,res)=>{
try{

const { userId, text } = req.body;
const postId = req.params.postId;
const comment = new commantmodel({
userId,
postId,
text
});

await comment.save();

const updatedPost = await Post.findByIdAndUpdate(
postId,
{ $push:{ Comment: comment._id } },
{ returnDocument: "after" }
);
res.json({
message:"Comment added",
comment,
post:updatedPost
});

}catch(err){
res.status(500).json(err);
}
};