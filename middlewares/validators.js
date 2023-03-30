import { body, validationResult } from "express-validator";
export const rules = [
  body("email")
    .isEmail()
    .withMessage("please provide us with a valid email")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("password should be string")
    .isLength({ min: 4 })
    .withMessage("password too short"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.json({
        success: false,
        message: errors.array().map((err) => ({ [err.param]: err.msg })),
      });
    }
  },
];
