import Joi from "joi";

export const addCouponVal = Joi.object({
  code: Joi.string().min(1).max(200).required().trim(),
  discount: Joi.number().min(0).required(),
  expires: Joi.date().required(),
  // important note that date be like month/days/year
});

export const updateCouponVal = Joi.object({
  id: Joi.string().hex().length(24).required(),

  code: Joi.string().min(1).max(200).trim(),
  discount: Joi.number().min(0),
  expires: Joi.date(),
});
