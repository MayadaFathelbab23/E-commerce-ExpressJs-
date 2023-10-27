const asyncHandler = require("express-async-handler");

const Product = require("../Models/ProductModel");
const Coupon = require("../Models/couponModel");
const Cart = require("../Models/cartModel");
const ApiError = require("../utils/apiError");

// to calculat total cart price
const totalCartPrice = (cart) => {
  let total = 0;
  cart.items.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
};

// @desc    Add product to cart
// @Route   POST    /api/carts
// @Access  private/auth/user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  let cart = await Cart.findOne({ user: req.user._id });
  // if user has no cart => Create a new cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, price: product.price, color }],
    });
    cart.totalPrice += product.price;
    // User has a cart
  } else {
    // 1- user add product already exist (With the same color)
    const itemIdx = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (itemIdx > -1) {
      cart.items[itemIdx].quantity += 1;
    } else {
      // User add new product or new color product
      cart.items.push({ product: productId, price: product.price, color });
    }
    cart.totalPrice += product.price;
  }
  // cart.totalPrice = totalCartPrice(cart)
  cart.discouteTotalPrice = undefined
  await cart.save();
  res.status(200).json({ message: "Product added successfully", data: cart });
});

// @desc    Get user cart
// @Route   GET    /api/carts
// @Access  private/auth/user

exports.getUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    return next(new ApiError("Your Cart is Empty", 404));
  }
  res.status(200).json({
    status: "Success",
    itemsLength: userCart.items.length,
    data: userCart,
  });
});

// @desc    Remove user cart item
// @Route   PUT    /api/carts
// @Access  private/auth/user

exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("cart is not found", 404));
  }
  cart.totalPrice = totalCartPrice(cart);
  cart.discouteTotalPrice = undefined
  await cart.save();
  res.status(200).json({
    status: "Success",
    data: cart,
  });
});

// @desc    Clear user cart item
// @Route   DELETE    /api/carts
// @Access  private/auth/user
exports.clearUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    update user cart item quantity
// @Route   PUT    /api/carts/:itemId
// @Access  private/auth/user

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("cart not found", 404));
  }
  const itemIdx = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIdx > -1) {
    cart.items[itemIdx].quantity = quantity;
  } else {
    return next(new ApiError("item not found", 404));
  }
  cart.totalPrice = totalCartPrice(cart);
  cart.discouteTotalPrice = undefined
  await cart.save();
  res.status(200).json({
    status: "Success",
    message: "Product quantity updated",
    data: cart,
  });
});

// @desc    Apply coupon on user cart
// @Route   PUT    /api/carts/
// @Access  private/auth/user

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // Verify Coupon
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if(!coupon){
    return next(new ApiError("Coupon not valid"))
  }
//   find and update user cart
  const cart = await Cart.findOne({user : req.user._id})
  const total = cart.totalPrice ;
  const discountValue = (total - (total * coupon.discount)).toFixed(2) //214.1245 => 214.13
  cart.discouteTotalPrice = discountValue ;
  await cart.save()
  res.status(200).json({status : "Success" , message : "Coupon applied successfuly" , data : cart})

});
