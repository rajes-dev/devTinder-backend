const mongoose = require("mongoose");

const connectionRequestSchema = new  mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    status:{
        type:String,
          require:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"]},
            message: `{VALUE} is incorrect status type`
    }
},
{
    timestamps: true,
});

connectionRequestSchema.index({fromUserId : 1, toUserId: 1}); //compound index

connectionRequestSchema.pre("save", function(next){

    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Error : you cannot send connection request to yourself");
    }

    next;
})
const ConnectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel; 