const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"]

      const isStatusValid = allowedStatus.includes(status);

      if(!isStatusValid){
        return res.status(400).json({message: "Invalid status sent" + status})
        }

        const existingConnectionReq = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });

        if(existingConnectionReq){
            return res.status(400).send({message: "connection request already exists"})
        }

        const isIdPresentInDb = await user.findById(toUserId);
        if(!isIdPresentInDb){
            return res.status(400).json({message: "User not found"});
        };

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({ message: "connection request successful", data });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{

    try{
        //status validation
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        const isStatusAllowed = allowedStatus.includes(status);
        if(!isStatusAllowed){
            return res.status(400).json({message: "Status not allowed"});
        }

        const isConnectionReqValid = await ConnectionRequestModel.findOne({
            _id: requestId  ,
            toUserId: loggedInUser._id,
            status:"interested"
        })
         if(!isConnectionReqValid){
            return res.status(400).json({message: "Request doesnt exist"})
        }

        isConnectionReqValid.status = status;
       const data = await isConnectionReqValid.save();
        res.json({message: "connection request " + status , data} )

        //loggedInuser should be toUserId, status should be interested, id should present in db
    }catch(err){
        res.status(400).send("Error" + err);
    }
})

module.exports = requestRouter;
