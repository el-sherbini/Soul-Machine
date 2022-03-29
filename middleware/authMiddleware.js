import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/auth");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/auth");
  }
};

// Check current user
export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
