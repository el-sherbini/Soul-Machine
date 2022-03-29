import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", pass: "" };

  // Incorrect email
  if (err.message === "Incorrect email")
    errors.email = "That email is not registered";

  // Incorrect password
  if (err.message === "Incorrect password")
    errors.pass = "That password is incorrect";

  // Duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered";
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge * 1000 });
};

export const signup_get = (req, res) => {
  res.render("auth");
};

export const login_get = (req, res) => {
  res.render("auth");
};

export const signup_post = async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await User.create({ email, pass });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

export const login_post = async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await User.login(email, pass);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

export const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
