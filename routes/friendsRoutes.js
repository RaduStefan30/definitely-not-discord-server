const express = require("express");
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const auth = require("../middleware/auth");
const {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
} = require("../controllers/friendsController");

const router = express.Router();

const invitationSchema = joi.object({
  email: joi.string().email().required(),
});

const decisionSchema = joi.object({
  id: joi.string().required(),
});

router.post("/invite", auth, validator.body(invitationSchema), sendInvitation);

router.post("/accept", auth, validator.body(decisionSchema), acceptInvitation);

router.post(
  "/decline",
  auth,
  validator.body(decisionSchema),
  declineInvitation
);

module.exports = router;
