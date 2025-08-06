export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 400).json({
    error_message: error.message,
    error,
    error_stack: error.stack,
  });
};

export const succssesResponse = ({
  res,
  message = "Success",
  status = 200,
  data = {},
} = {}) => {
  return res.status(status).json({ message, data });
};
