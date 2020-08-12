'use script'

const Tweet = require('../Models/Tweet');
const User = require("../Models/User");

async function addOriginalTweet (req,res){
    const tweet = new Tweet;
    const params = req.body.command.substring(10);
    var D = new Date
    var dia = D.getDate()
    var mes = D.getMonth()+1
    var year = D.getFullYear()

    console.log(params);
    

    if(params.length>0){
        tweet.user = req.user.sub;
        tweet.type = 'original';
        tweet.createDate = (year+'-'+mes+'-'+dia);
        tweet.content = params;
        try {
            var savedTweet = await tweet.save();
            return res.status(200).send({message: savedTweet});
        } catch (error) {
            return res.status(500).send({ message: error });    
        }
    }else{
        return res.status(500).send({ message: "Error, llene todos los datos" });
    }
}

async function editTweet (req,res){
    const params = req.body.command.split(" ");
    const tweet = req.body.command.substring(36);
    
    if(params.length>=3){
        try {
            var editedTweet = await Tweet.findOneAndUpdate({_id:params[1], user:req.user.sub},{content:tweet},{new:true});
            if(!editedTweet) return res.status(500).send({ message: "No se encontro el tweet" });
            return res.status(500).send({ message: editedTweet });
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }else{
        return res.status(500).send({ message: "Error, llene todos los datos" });
    }
}

async function deleteTweet (req,res){
    const params = req.body.command.split(" ");
    
    if(params.length==2){
        try {
            const deletedTweet = await Tweet.findOneAndDelete({_id:params[1], user:req.user.sub});
            return res.status(500).send({ message: deletedTweet });         
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }else{
        return res.status(500).send({ message: "Error, revise los datos" });
    }
}

async function viewTweets (req,res){
    params = req.body.command.split(" ");
    try {
        var findUser = await User.findOne({ user: params[1] });
        if(!findUser) return res.status(500).send({ message: "El usuario no existe" });
        if(findUser._id!=req.user.sub){
            var reviewUser = await User.findOne({ _id: req.user.sub, 'following.user': params[1]});
            if(!reviewUser) return res.status(500).send({ message: "Debe seguir al usuario para ver sus Tweets" }); 
        }
        const findedTweets = await Tweet.find({user:findUser._id},{likes:0,retweet:0,comments:0});
        return res.status(500).send({ message: findedTweets });         
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

async function likeTweet (req,res){
    const params = req.body.command.split(" ");
    try {
        const findedTweet = await Tweet.findOne({_id:params[1], 'likes.user':req.user.sub});
        if(!findedTweet){
            const likedTweet = await Tweet.findByIdAndUpdate(params[1], {$inc:{countLikes:1},$push:{likes:{user:req.user.sub}}},{new:true});
            return res.status(200).send({likedTweet}) 
        }else{
            const likedTweet = await Tweet.findByIdAndUpdate(params[1], {$inc:{countLikes:-1},$pull:{likes:{user:req.user.sub}}}, {new:true});
            return res.status(200).send({likedTweet}) 
        }
    } catch (error) {
        return res.status(500).send({Error: error.message})
    }
}

async function retweet (req,res){
    const params = req.body.command.split(" ");
    try {
        const findedTweet = await Tweet.findOne({_id:params[1], 'retweet.user':req.user.sub});
        if(!findedTweet){
            const retweetedTweet = await Tweet.findByIdAndUpdate(params[1], {$inc:{countRetweets:1},$push:{retweet:{user:req.user.sub}}},{new:true});
            let D = new Date
            let dia = D.getDate()
            let mes = D.getMonth()+1
            let year = D.getFullYear()
            let newTweet = new Tweet;
            newTweet.type = 'retweet';
            newTweet.content = retweetedTweet.content;
            newTweet.user = req.user.sub;
            newTweet.reference = {tweet: retweetedTweet._id};
            newTweet.createDate = (year+'-'+mes+'-'+dia);
            const newRetweet = await newTweet.save();
            return res.status(200).send({newRetweet});
        }else{
            const likedTweet = await Tweet.findByIdAndUpdate(params[1], {$inc:{countRetweets:-1},$pull:{retweet:{user:req.user.sub}}}, {new:true});
            const deletedRetweet = await Tweet.findOneAndDelete({type: 'retweet', 'reference.tweet': params[1], user:req.user.sub});
            return res.status(200).send({deletedRetweet}); 
        }
    } catch (error) {
        return res.status(500).send({Error: error.message})
    }
}

async function replyTweet (req,res){
    const params = req.body.command.split(" ");
    const tweet = req.body.command.substring(36);

    try {
        const originalTweet = await Tweet.findByIdAndUpdate(params[1],{$inc:{countComments:1}},{new:true});
        //throw new Error
        let D = new Date
        let dia = D.getDate()
        let mes = D.getMonth()+1
        let year = D.getFullYear()
        let reply = new Tweet;
        reply.user = req.user.sub;
        reply.type = 'reply';
        reply.content = tweet;
        reply.reference = originalTweet.reference.concat({tweet: originalTweet._id});
        reply.createDate = (year+'-'+mes+'-'+dia);
        const newReply = await reply.save();
        return res.status(200).send({newReply});
    } catch (error) {
        return res.status(500).send({Error:error.message})
    }
}

module.exports = {
    addOriginalTweet,
    editTweet,
    deleteTweet,
    viewTweets,
    likeTweet,
    retweet,
    replyTweet
}