import Joi from "joi";

export const addToWishListVal = Joi.object({
  product: Joi.string().hex().length(24).required(),
});

export const updateWishListVal = Joi.object({
  product: Joi.string().hex().length(24),
});
