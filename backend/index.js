const express = require("express");

const cors = require("cors");

const Users = require("./routes/user");

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/usersignuplogin")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Connection error", err));

// Routes

app.use("/user", Users);

// Route to create new admin

app.post("/admin/signup", async (req, res) => {
  const { username, password, email } = req.body;

  // Checking if we got the username, password and email
  if (!username || !password || !email) {
    return res.send({ message: "Please provide all the required fields" });
  }

  // Checking if the user already exists

  // Here $or means either username or email should be equal to the username or email that we are getting from the request
  const existingAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existingAdmin) {
    return res.send({ message: "Admin already exists" });
  }

  // If the user does not exist, create a new user

  try {
    const admin = new Admin({ username, password, email });
    await admin.save();
    console.log("Admin created:", admin);
    res.send({
      message: "Admin created successfully",
      admin: { username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.send({ message: "Error creating admin" });
  }
});

// Route to login admin

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  // Checking if we got the username and password

  if (!username || !password) {
    return res.send({ message: "Please provide username and password" });
  }

  // Checking if the user existss

  try {
    const admin = await Admin.findOne({ username });

    // If the user does not exist OR the password doesn;t match return an error message
    if (!admin || admin.password !== password) {
      return res.send({ message: "Login failed" });
    }

    console.log("Admin logged in:", admin);
    res.send({
      message: "Admin logged in successfully",
      admin: { username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.send({ message: "Error logging in" });
  }
});

// Route to update the admin
app.put("/admin/update", async (req, res) => {
  const { username, password, newUsername, newPassword, newEmail } = req.body;

  // Checking if we got the required fields
  if (!username || !password || !newUsername || !newPassword || !newEmail) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const admin = await Admin.findOne({ username, password });

    if (!admin) {
      return res.send({ message: "Login failed" });
    }

    admin.username = newUsername;
    admin.password = newPassword;
    admin.email = newEmail;

    await admin.save();
    res.json({ admin });
  } catch (err) {
    res.send({ message: "Error updating admin" });
  }
});

// Route to get all users

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.send({ message: "Error getting users" });
  }
});

// Delete a user by username

app.delete("/user/delete", async (req, res) => {
  const { username } = req.headers;

  // Checking if we got the required fields
  if (!username) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.send({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.send({ message: "Error deleting user" });
  }
});

// Route to create a new course

app.post("/courses/add", async (req, res) => {
  const { cId, cName, description, price } = req.body;

  // Checking if we got the required fields

  if (!cId || !cName || !description || !price) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const newCourse = new Course({
      cId,
      cName,
      description,
      price,
    });
    await newCourse.save();
    res.json({ product: newCourse });
  } catch (err) {
    res.send({ message: "Error adding product" });
  }
});

// Route to update a course

app.put("/courses/update", async (req, res) => {
  const { cId, cName, description, price } = req.body;

  // Checking if we got the required fields

  if (!cId || !cName || !description || !price) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const course = await Course.findOne({ cId });

    if (!course) {
      return res.send({ message: "Course not found" });
    }

    course.cName = cName;
    course.description = description;
    course.price = price;

    await course.save();
    res.json({ course });
  } catch (err) {
    res.send({ message: "Error updating course" });
  }
});

//  Delete a course by cId

app.delete("/courses/delete", async (req, res) => {
  const { cId } = req.headers;

  // Checking if we got the required fields
  if (!cId) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const course = await Course.findOneAndDelete({ cId });
    if (!course) {
      return res.send({ message: "Course not found" });
    }
    res.json({ course });
  } catch (err) {
    res.send({ message: "Error deleting course" });
  }
});

// Route to purchase a course

app.post("/courses/purchase", async (req, res) => {
  const { username, password, cId, cName, description } = req.body;

  // Checking if we got the required fields
  if (!username || !password || !cId || !cName || !description) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.send({ message: "Login failed" });
    }

    // Check if the product exists
    const course = await Course.findOne({ cId });
    if (!course) {
      return res.send({ message: "Course not found" });
    }

    // Check if the course is already purchased if not add it
    const isPurchased = user.purchasedCourse.find(
      (course) => course.cId === cId
    );
    if (isPurchased) {
      return res.send({ message: "Course already purchased" });
    }

    user.purchasedCourse.push({
      cId,
      cName,
      description,
      price,
      completed: false,
    });

    await user.save();
    res.json({ user });
  } catch (err) {
    res.send({ message: "Error adding purchased course" });
  }
});

// Route to get all purchased courses

app.get("/courses/purchased", async (req, res) => {
  const { username, password } = req.headers;
  // Checking if we got the required fields
  if (!username || !password) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.send({ message: "Login failed" });
    }

    res.json({ purchasedCourse: user.purchasedCourse });
  } catch (err) {
    res.send({ message: "Error getting purchased courses" });
  }
});

// Route to mark a course as completed

app.put("/courses/complete", async (req, res) => {
  const { username, password, cId } = req.body;

  // Checking if we got the required fields
  if (!username || !password || !cId) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.send({ message: "Login failed" });
    }

    const course = user.purchasedCourse.find((product) => product.cId === cId);
    if (!course) {
      return res.send({ message: "Course not found" });
    }

    course.completed = true;

    await user.save();
    res.json({ user });
  } catch (err) {
    res.send({ message: "Error completing course" });
  }
});

// Route to get all completed courses

app.get("/courses/completed", async (req, res) => {
  const { username, password } = req.headers;
  // Checking if we got the required fields
  if (!username || !password) {
    return res.send({ message: "Provide all fields" });
  }

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.send({ message: "Login failed" });
    }

    const completedCourses = user.purchasedCourse.filter(
      (course) => course.completed
    );

    res.json({ completedCourses });
  } catch (err) {
    res.send({ message: "Error getting completed courses" });
  }
});

app.use((req, res) => {
  res.status(404).send({ message: "Route does not exist" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
