import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token exists & is verified
  if (token) {
    jwt.verify(token, "Omda secret", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/auth");
      } else {
        console.log(decodedToken);
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
    jwt.verify(token, "Omda secret", async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
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
