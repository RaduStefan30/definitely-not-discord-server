const Invitation = require("../models/Invitation");
const User = require("../models/User");

const friendsHandler = require("../socketHandlers/friendsHandler");

const sendInvitation = async (req, res) => {
  const recipientEmail = req.body.email.toLowerCase();

  const { id, email } = req.user;

  if (email.toLowerCase() === recipientEmail)
    return res.status(409).send("You cannot send an invite to yourself");

  const recipient = await User.findOne({ email: recipientEmail });

  if (!recipient)
    return res.status(404).send("There is no user matching this email address");

  const alreadyInvited = await Invitation.findOne({
    senderId: id,
    recipientId: recipient._id,
  });

  if (alreadyInvited) {
    return res
      .status(409)
      .send("An invitation has already been sent to this email address");
  }
  const alreadyFriends = recipient.friends.find(
    (friend) => friend.toString() === id.toString()
  );

  if (alreadyFriends) {
    return res
      .status(409)
      .send("The user with this email address is already your friend");
  }

  const invitation = await Invitation.create({
    senderId: id,
    recipientId: recipient._id,
  });

  friendsHandler.updateInvitations(recipient._id.toString());

  return res.status(201).send("Invitation successfully sent");
};

const acceptInvitation = async (req, res) => {
  try {
    const { id } = req.body;

    const invitation = await Invitation.findById(id);

    if (!invitation)
      res
        .status(400)
        .send("Something went wrong. The invitation could not be accepted");

    const { senderId, recipientId } = invitation;

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends = [...sender.friends, recipientId];
    recipient.friends = [...recipient.friends, senderId];

    await sender.save();
    await recipient.save();

    await Invitation.findByIdAndDelete(id);

    friendsHandler.updateInvitations(recipientId.toString());

    friendsHandler.updateFriends(recipientId.toString());
    friendsHandler.updateFriends(senderId.toString());

    return res.status(200).send("Invitation accepted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Try again later");
  }
};

const declineInvitation = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user.id;

    const invitationExists = await Invitation.exists({ _id: id });

    if (invitationExists) {
      await Invitation.findByIdAndDelete(id);
    }

    friendsHandler.updateInvitations(userId);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Try again later");
  }
  return res.status(200).send("Invitation declined");
};

module.exports = { sendInvitation, acceptInvitation, declineInvitation };
