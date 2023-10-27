const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "User is required "],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        price: Number,
        color: String,
      },
    ],
    taxPrice: Number,
    shippingPrice: Number,
    totalOrderPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    isPaied: {
      type: Boolean,
      default: false,
    },
    paiedAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email phone profileImage" })
    .populate({path : "cartItems.product" , select : 'title price imageCover'})
    next()
});
module.exports = mongoose.model("Order", orderSchema);
