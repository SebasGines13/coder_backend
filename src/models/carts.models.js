import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId, // ID autogenerado de MongoDB
          ref: "products",
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
    default: function () {
      return [];
    },
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.id_prod");
});

const cartModel = model("carts", cartSchema);
export default cartModel;
