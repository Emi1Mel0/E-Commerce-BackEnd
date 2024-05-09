import { globalError } from "./Middleware/globalErrorMiddleWare.js";
import authenticationRouter from "./modules/Authentication/authentication.routes.js";
import addressRouter from "./modules/address/address.routes.js";
import brandRouter from "./modules/brand/brand.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import subCategoryRouter from "./modules/subCategory/subCategory.routes.js";
import userRouter from "./modules/user/user.routes.js";
import wishListRouter from "./modules/wishList/wishList.routes.js";
import { appError } from "./utils/AppError.js";

export const bootstrap = (app) => {
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/authentication", authenticationRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishList", wishListRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);

  
  app.all("*", (req, res, next) => {
    next(new appError(`page not found:${req.originalUrl}`, 404));
    // we use it to send it to the global error handler
  });
  app.use(globalError);
};
