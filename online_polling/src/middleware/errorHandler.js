import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || undefined,
  });
};
