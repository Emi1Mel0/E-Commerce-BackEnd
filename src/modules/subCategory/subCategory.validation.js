import Joi from "joi";

export const addSubCategoryVal = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  Category:Joi.string().hex().length(24).required(),
});

export const updateSubCategoryVal = Joi.object({
  id: Joi.string().hex().length(24).required(),

  name: Joi.string().min(2).max(100).trim(),
  Category:Joi.string().hex().length(24),
});
