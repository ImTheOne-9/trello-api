/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

export const handleErrorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (process.env.NODE_ENV === 'production') {
    delete responseError.stack
  }

  console.error(responseError)

  res.status(responseError.statusCode).json(responseError)
}
