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
        const findedTweets = await Tweet.find({user:findUser._id});
        return res.status(500).send({ message: findedTweets });         
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

module.exports = {
    addOriginalTweet,
    editTweet,
    deleteTweet,
    viewTweets,
}