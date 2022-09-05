const User = require("../models/User")
const router = require('express').Router();
const bcrypt = require("bcrypt")

//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("successfully updated")
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account")
    }
});

//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("successfully deleted")
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only your account")
    }
});

//get a user
router.get("/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id); 
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
});

//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.id !== req.params.id){
        try{
            const user = await User.findById(req.params.id); //target user(to be followed)
            const currUser = await User.findById(req.body.userId); //follower
            if(!user.followers.includes(req.body.userId)){ // if current user is not in user's followers list
                await user.updateOne({$push:{followers:req.body.userId}}) //add current user in user's follower list
                await currUser.updateOne({$push:{following:req.params.id}}); // add user in current user's following list
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you already follow this user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you cant follow yourself")
    }
})
//unfollow a user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.id !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.id); //58:00
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("you dont follow this user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    } else{
        res.status(403).json("you cant unfollow yourself");
    }
})

// router.get("/", (req,res)=>{
//     res.send("hey its user route")
// })

module.exports = router