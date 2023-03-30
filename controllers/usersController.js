import UserCollection from "../models/userSchema.js";
import ImageCollection from "../models/imageSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  // request handle // controller
  try {
    const products = await UserCollection.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addNewUser = async (req, res) => {
  try {
    const user = new UserCollection(req.body);
    if (req.files) {
      const image = new ImageCollection({
        filename: new Date().getTime() + "_" + req.files.image.name,
        data: req.files.image.data,
        userId: user._id,
      });
      await image.save();
      user.profileImage = `http://localhost:4000/images/${image.filename}`;
    }
    // hashing the password

    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
    // storing user in the database
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await UserCollection.findById(id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.json({ success: false, message: "Product not found" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await UserCollection.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, data: product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await UserCollection.findByIdAndDelete(id);
    res.json({ success: true, data: deletedProduct });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  // authentication is a process of authorizing user
  // issue token (certificate)
  try {
    const { email, password } = req.body;
    // finding user by email // verifying email
    const user = await UserCollection.findOne({ email });
    if (user) {
      // verify password
      const verifyPassword = bcrypt.compare(password, user.password); // returns Boolean

      if (verifyPassword) {
        // issue token
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.SIGNATURE,
          { expiresIn: "1h" }
        );
        res.header("token", token).json({ success: true, data: user });
      } else {
        res.json({ success: false, message: "Password doesn't match" });
      }
    } else {
      res.json({ success: false, message: err.message });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
