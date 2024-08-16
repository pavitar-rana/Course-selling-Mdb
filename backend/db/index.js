const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  email: String,
  // Set the type to an array Products
  purchasedCourse: [
    {
      cId: String,
      cName: String,
      description: String,
      price: { type: String },
      completed: { type: Boolean, default: false },
    },
  ],
});

const adminSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  email: String,
});

// Create a schema for the product

const courseSchema = new mongoose.Schema({
  cId: String,
  cName: String,
  description: String,
  price: String,
});

// Config Schema

const configSchema = new mongoose.Schema({
  noUsers: String,
  noCourses: String,
  noAdmins: String,
});

// Create user and product models

const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Config = mongoose.model("Config", configSchema);

//  Export the models

module.exports = { User, Course, Admin, Config };
