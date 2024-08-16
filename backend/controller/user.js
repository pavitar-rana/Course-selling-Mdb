const User = require("../db/user");

async function userSignup(req, res) {
  const { username, password, email } = req.body;

  // Checking if we got the username, password and email
  if (!username || !password || !email) {
    return res.send({ message: "Please provide all the required fields" });
  }

  // Checking if the user already exists

  // Here $or means either username or email should be equal to the username or email that we are getting from the request
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.send({ message: "User already exists" });
  }

  // If the user does not exist, create a new user

  try {
    const Config = await Config.findOne();

    if (!Config) {
      const config = new Config({ noUsers: 0, noCourses: 0, noAdmins: 0 });
      await config.save();
    }

    const con = await Config.findOne();

    con.noUsers++;

    const user = new User({ id: Config.noUsers, username, password, email });
    await user.save();
    await con.save();
    console.log("User created:", user);
    res.send({
      message: "User created successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.send({ message: "Error creating user" });
  }
}

async function userLogin(req, res) {
  const { username, password } = req.body;

  // Checking if we got the username and password

  if (!username || !password) {
    return res.send({ message: "Please provide username and password" });
  }

  // Checking if the user existss

  try {
    const user = await User.findOne({ username });

    // If the user does not exist OR the password doesn;t match return an error message
    if (!user || user.password !== password) {
      return res.send({ message: "Login failed" });
    }

    console.log("User logged in:", user);
    res.send({
      message: "User logged in successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    res.send({ message: "Error logging in" });
  }
}

async function userUpdate(req, res) {
  const { username, password, newUsername, newPassword, newEmail } = req.body;

  // Checking if we got the required fields
  if (!username || !password || !newUsername || !newPassword || !newEmail) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.send({ message: "Login failed" });
    }

    user.username = newUsername;
    user.password = newPassword;
    user.email = newEmail;

    await user.save();
    res.json({ user });
  } catch (err) {
    res.send({ message: "Error updating user" });
  }
}

module.exports = { userSignup, userLogin, userUpdate };
