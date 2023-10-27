const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51O5V5uLmIQwVCyBoXhBrkFKOmZYOtjVsxQrDjjuca8fcjfjchdM62he7Y6Jh8gVw7CMIq3o0PNwnlnzmMMFbsos400g5nMKRyF"
);

const ApiError = require("../utils/apiError");
const factory = require("./handlerFactory");
const Order = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");
const Cart = require("../Models/cartModel");

// @desc    Create cash order
// @Route   POST    api/orders/:cartId
// @Access  privat/auth/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1 Get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`No cart for this id ${req.params.cartId} `));
  }
  // 2 get order price from cart (with coupon / not)
  const cartPrice = cart.discouteTotalPrice
    ? cart.discouteTotalPrice
    : cart.totalPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;
  // 3 create order (cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.items,
    totalOrderPrice: orderPrice,
    shippingAddress: req.body.address,
  });
  // 4 update products quantity and sold
  if (order) {
    const bulkOptions = cart.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    // 5 clear cart
    await Cart.findByIdAndDelete(req.params.cartId);
    res.status(201).json({
      status: "Success",
      data: order,
    });
  }
});

// @desc    get all orders
// @Route   GET    api/orders
// @Access  privat/auth/user - admin - maneger

// filter (user orders)
exports.userOrderFilter = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});
exports.getAllOrders = factory.getAll(Order);

// @desc    get one orders
// @Route   GET    api/orders/:id
// @Access  privat/auth/user - admin - maneger
exports.getOneOrder = factory.getOne(Order);

// @desc   Update order paid status
// @Route   PUT    api/orders/:id/paid
// @Access  privat/auth/admin - maneger

exports.updateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not Exist", 404));
  }
  // update order paid
  order.isPaied = true;
  order.paiedAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc   Update order delivered status
// @Route   PUT    api/orders/:id/deliver
// @Access  privat/auth/admin - maneger

exports.updateOrderDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not Exist", 404));
  }
  // update order paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "Success", data: updatedOrder });
});

// @desc   Create checkout session from stripe and return it on response
// @Route   POST    api/orders/checkout-session/:cartId
// @Access  privat/auth/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1 Get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`No cart for this id ${req.params.cartId} `));
  }
  // 2 get order price from cart (with coupon / not)
  const cartPrice = cart.discouteTotalPrice
    ? cart.discouteTotalPrice
    : cart.totalPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: orderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/carts`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });
  // 4 Send session to response
  res.status(200).json({ status: "Success", session });
});

exports.checkoutWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      res.body,
      sig,
      process.env.WEBHOOK_SECRETE
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if(event.type === "checkout.session.completed"){
    console.log('Create order here')
  }
});
