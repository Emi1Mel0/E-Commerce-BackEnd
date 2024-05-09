import Joi from "joi";

export const createOrderVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  shippingAddress: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    zipcode: Joi.string()
      .pattern(/^\d{5}(-\d{4})?(?!-)$/)
      .required(),
  }),
});

export const updateQTYVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().options({ convert: false }).required(),
  // the abbreviation of quantity is QTY
});
