import Joi from "joi";

const signupVal = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9]{8,}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  age: Joi.number().integer().min(10).max(80).required(),
});

const signInVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][a-z0-9]{8,}$/)
    .required(),
});

const changePasswordVal = Joi.object({
  oldPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9]{8,}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9]{8,}$/)
    .required(),
});

export { signupVal, signInVal, changePasswordVal };
