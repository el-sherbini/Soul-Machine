import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  pass: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [4, "Minimum password length is 4 characters"],
  },
});

// Fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.pass = await bcrypt.hash(this.pass, salt);
  next();
});

// Static method to login user
userSchema.statics.login = async function (email, pass) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(pass, user.pass);
    if (auth) return user;
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("user", userSchema);

export default User;
