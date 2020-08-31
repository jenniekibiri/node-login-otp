const express = require("express");

const router = express.Router();
const { signin, signout, signup,socialLogin} = require("../controllers/auth");
const { userById } = require("../controllers/users");

const { signinValidator } = require("../validator");
router.post("/sociallogin", socialLogin)
router.post("/signup", signinValidator, signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.param("UserId", userById);
module.exports = router;
