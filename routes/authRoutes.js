const express = require("express");
const joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const { login, register } = require("../controllers/authController");
const auth = require("../middleware/auth");

const registerSchema = joi.object({
  email: joi.string().email().required(),
  username: joi.string().min(3).max(20).required(),
  password: joi.string().min(4).max(24).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(4).max(24).required(),
});

const router = express.Router();

router.post("/register", validator.body(registerSchema), register);

router.post("/login", validator.body(loginSchema), login);

module.exports = router;
