import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("-password"); //not-equal and select everything minus the password

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersforSidebar:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params.id;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    }); //Find all messages where I am the sender or all messages where the other user is the sender and I am the receiver

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getUsersforSidebar:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //TODO: realtime messaging functionality using socket.io goes here

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in getUsersforSidebar:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
