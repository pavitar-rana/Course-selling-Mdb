const express = require("express");

const router = express.Router();

const { userSignup, userLogin, userUpdate } = require("../controller/user");

// Route to create new user

router.post("/signup", userSignup);

// Route to login user

router.post("/login", userLogin);

// Route to update the user
router.put("/update", userUpdate);

module.exports = router;
