import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const { compare, hash } = bcryptjs;
const { sign } = jsonwebtoken;

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email");
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAccessToken = function () {
  const user = this;

  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

userSchema.methods.generateRefreshToken = function () {
  const user = this;

  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email or Password did not match");

  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new Error("Email or Password did not match");

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await hash(user.password, 12);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export { User };
