import Joi from "joi";

export const addAddressVal = Joi.object({
  street: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  zipcode: Joi.string()
    .pattern(/^\d{5}(-\d{4})?(?!-)$/)
    .required(),
});

export const updateAddressVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  street: Joi.string().trim(),
  phone: Joi.string().trim(),
  city: Joi.string().trim(),
  country: Joi.string().trim(),
  zipcode: Joi.string().pattern(/^\d{5}(-\d{4})?(?!-)$/),
});
