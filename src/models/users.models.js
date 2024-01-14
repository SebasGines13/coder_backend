import { Schema, model } from "mongoose";
import cartModel from "./carts.models.js";
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: String,
    reference: String,
  },
  { _id: false }
);

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "user",
    enum: ["admin", "user", "premium"],
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: [fileSchema],
  last_connection: {
    type: Schema.Types.Date,
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    // Si el usuario no tiene un carrito asignado, crea uno nuevo
    if (!this.cart) {
      const newCart = await cartModel.create({});
      this.cart = newCart._id;
    }
  } catch (error) {
    next(error);
  }
});

const userModel = model("users", userSchema);

export default userModel;
