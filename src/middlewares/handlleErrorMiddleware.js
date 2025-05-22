/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
export const handleErrorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'development') {
    delete responseError.stack
  }

  console.error(responseError)

  res.status(responseError.statusCode).json(responseError)
}
