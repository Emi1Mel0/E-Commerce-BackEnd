import { errorCatcher } from "../../Middleware/catchError.js";
import { cartModel } from "../../../DataBases/models/cart.model.js";
import { productModel } from "../../../DataBases/models/product.model.js";
import { appError } from "../../utils/AppError.js";
import { couponModel } from "../../../DataBases/models/coupon.model.js";
import { orderModel } from "../../../DataBases/models/order.model.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_KEY);

export const createCashOrder = errorCatcher(async (req, res, next) => {
  // 1- get cart -> cart_id
  let isCartExist = await cartModel.findById(req.params.id);
  if (!isCartExist) return next(new appError("cart not found", 404));

  //2- total order price
  let totalOrderPrice = isCartExist.totalPriceAfterDiscount
    ? isCartExist.totalPriceAfterDiscount
    : isCartExist.totalPrice;

  //3- create order -> cash
  let order = new orderModel({
    user: req.user._id,
    orderItems: isCartExist.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  await order.save();

  //4- increment sold & decrement quantity
  // bulk concept what is it ?
  // In MongoDB, the "bulk" concept refers to the ability to perform multiple write operations,
  //such as inserts, updates, or deletes, in a single database operation.
  //This can be more efficient than performing each write operation individually,
  //as it reduces the number of network round-trips required to complete the operations.
  // so it simply improve performance

  let options = isCartExist.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
      },
    };
  });

  await productModel.bulkWrite(options);

  //Sends multiple insertOne, updateOne, updateMany, replaceOne, deleteOne, and/or deleteMany operations
  //to the MongoDB server in one command.
  //This is faster than sending multiple independent operations
  //(e.g. if you use create()) because with bulkWrite()
  //there is only one network round trip to the MongoDB server.

  //5- clear cart
  await cartModel.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "the order fetched successfully", order });
});

export const getSpecificOrder = errorCatcher(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("orderItems.product");
  res.status(200).json({ message: "the order fetched successfully", order });
});

export const getAllOrders = errorCatcher(async (req, res, next) => {
  let orders = await orderModel.find().populate("orderItems.product");
  res.status(200).json({ message: "the order fetched successfully", orders });
});

export const createCheckOutSession = errorCatcher(async (req, res, next) => {
  // 1- get cart -> cart_id
  let isCartExist = await cartModel.findById(req.params.id);
  if (!isCartExist) return next(new appError("cart not found", 404));

  //2- total order price
  let totalOrderPrice = isCartExist.totalPriceAfterDiscount
    ? isCartExist.totalPriceAfterDiscount
    : isCartExist.totalPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://www.google.com/",
    // specific path if the payment done successfully
    // cancel_url: " ",
    // get the client back  where the order was made
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    //where you can put a special id that related to the user
    // could be userID or cartID or OrderID,
    metadata: req.shippingAddress,
    //any additional data you want to add for eg. shipping address
  });
  res.json({ message: "done successfully", session });
});
