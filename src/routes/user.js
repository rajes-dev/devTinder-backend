const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_dATA = "firstName lastName age gender photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionrequest = await ConnectionRequestModel.find({
      toUserId: loggedInuser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_dATA);

    res.json({ message: "Data fetched successfully", data: connectionrequest });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, 
            status: "accepted" 
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_dATA)
      .populate("toUserId", USER_SAFE_dATA);

    const data = connectionRequest.map((each) => {
      if (each.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return each.toUserId;
      }
      return each.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = userRouter;
