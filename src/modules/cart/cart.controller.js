import { errorCatcher } from "../../Middleware/catchError.js";
import { cartModel } from "../../../DataBases/models/cart.model.js";
import { productModel } from "../../../DataBases/models/product.model.js";
import { appError } from "../../utils/AppError.js";
import { couponModel } from "../../../DataBases/models/coupon.model.js";

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;

  if (cart.discount) {
    let totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    if (totalPriceAfterDiscount < 0) {
      return next(new appError("coupon is not valid", 401));
    }
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  }
};

export const addCart = errorCatcher(async (req, res, next) => {
  let product = await productModel.findById(req.body.product);
  if (!product) return next(new appError("product not found", 404));
  if (req.body.quantity > product.quantity)
    return next(new appError("quantity sold out", 409));
  req.body.price = product.price;
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image
  let isCartExists = await cartModel.findOne({ user: req.user._id });
  if (!isCartExists) {
    const cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcTotalPrice(cart);
    await cart.save();
    !cart && res.status(404).json({ status: 404, message: "cart not found" });
    cart &&
      res.status(200).json({
        status: 200,
        message: "cart updated successfully",
        cart,
      });
  } else {
    let item = isCartExists.cartItems.find(
      (item) => item.product == req.body.product
    );
    // find is method inside the array methods
    if (item) {
      if (item.quantity >= product.quantity) {
        return next(new appError("quantity sold out", 409));
      }
      item.quantity += req.body.quantity || 1;
    } else {
      isCartExists.cartItems.push(req.body);
    }
    calcTotalPrice(isCartExists);
    await isCartExists.save();
    res.status(200).json({
      status: 200,
      message: "cart updated successfully",
      cart: isCartExists,
    });
  }
});

export const removeCart = errorCatcher(async (req, res, next) => {
  // we will use the pull function by the _id of the product or
  // or to be specified that the id of the cartItem as defined indexes and so on

  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    {
      new: true,
    }
  );

  // how to edit inside the array inside the database
  // $pop
  // $pull
  // both are equally but  $pull will only pop if it is unique
  // $pop will pop if it is not unique
  // so we use $pull
  // we use $pull because we don't want to change the order of the array
  calcTotalPrice(cart);
  await cart.save();
  !cart && res.status(404).json({ status: 404, message: "cart not found" });
  cart &&
    res.status(200).json({
      status: 200,
      message: "cart updated successfully",
      cart,
    });
});

export const updateQuantity = errorCatcher(async (req, res, next) => {
  // we will use the pull function by the _id of the product or
  // or to be specified that the id of the cartItem as defined indexes and so on

  const cart = await cartModel.findOne({ user: req.user._id });
  !cart && res.status(404).json({ status: 404, message: "cart not found" });
  let item = cart.cartItems.find((item) => item._id == req.params.id);
  // don't use === because it might return false for some reason
  // to be sp
  if (!item) return next(new appError("item not found", 404));
  item.quantity = req.body.quantity;

  calcTotalPrice(cart);
  await cart.save();
  cart &&
    res.status(200).json({
      message: "cart updated successfully",
      cart,
    });
});

export const getLoggedUserCart = errorCatcher(async (req, res, next) => {
  const cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  !cart && res.status(404).json({ status: 404, message: "cart not found" });

  cart &&
    res.status(200).json({
      status: 200,
      message: "carts fetched successfully",
      cart,
    });
});

export const clearUserCart = errorCatcher(async (req, res, next) => {
  const cart = await cartModel.findOneAndDelete({ user: req.user._id });
  !cart && res.status(404).json({ status: 404, message: "cart not found" });

  cart &&
    res.status(200).json({
      message: "carts deleted successfully",
      cart,
    });
});

export const applyCoupon = errorCatcher(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    code: req.body.coupon,
    expires: { $gte: Date.now() },
  });
  if (!coupon) return next(new appError("coupon not found", 401));
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new appError("cart not found", 401));
  let totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  if (totalPriceAfterDiscount < 0) {
    return next(new appError("coupon is not valid", 401));
  }
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  cart.discount = coupon.discount;
  calcTotalPrice(cart);
  await cart.save();
  res.json({ message: "success", cart });
});
