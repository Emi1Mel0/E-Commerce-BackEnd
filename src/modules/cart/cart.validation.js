import Joi from "joi";

export const addToCartVal = Joi.object({
  product: Joi.string().hex().length(24).required(),
  quantity:Joi.number().integer().options({convert:false})
});

export const updateQTYVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  quantity:Joi.number().integer().options({convert:false}).required()
  // the abbreviation of quantity is QTY
});
