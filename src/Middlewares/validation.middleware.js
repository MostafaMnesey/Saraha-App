import { asyncHandler } from "../utils/response.js";

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    console.log(Object.keys(schema));
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key],{abortEarly:false});
      if (validationResult.error) {
        validationError.push(validationResult.error.details);
      }
    }
    if (validationError.length) {
      return res.status(400).json(
        {
          message: "validation error",
          error: validationError
        }
      )
    }   
    return next();
  });
};



