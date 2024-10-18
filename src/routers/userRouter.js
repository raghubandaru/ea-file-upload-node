import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

router.post("/api/users", async (req, res) => {
  const { email } = req.body;

  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    return res
      .status(400)
      .send({ error: "Account already exists with email provided" });
  }

  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    const accessToken = savedUser.generateAccessToken();

    res.cookie("bid", savedUser.generateRefreshToken(), {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      path: "/users/refresh_token",
    });

    res.status(201).send({ user: savedUser, accessToken });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    if (user) {
      const accessToken = user.generateAccessToken();

      res.cookie("bid", user.generateRefreshToken(), {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: "/users/refresh_token",
      });

      res.status(201).send({ user, accessToken });
    } else {
      res.status(400).send({ error });
    }
  } catch (error) {
    if (error.message === "Email or Password did not match") {
      return res.status(401).send({ error: error.message });
    } else {
      res.status(400).send({ error });
    }
  }
});

export default router;
