const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      name: {
        type: String,
        required: [true, "User name is required"],
      },
      email: {
        type: String,
        required: [true, "User email is required"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
