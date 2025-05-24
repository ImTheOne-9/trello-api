import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { WHITELIST_DOMAIN } from '~/utils/constants'
import { env } from './environment'

export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phep viec goi API bang POSTMAN trong moi truong Dev
    if (!origin && env.BUILD_MODE === 'development') {
      return callback(null, true)
    }

    // Kiem tra origin co phai Domain duoc chap nhan khong
    if (WHITELIST_DOMAIN.includes(origin)) {
      return callback(null, true)
    }


    return callback(new ApiError(`${origin} not allowed by our CORS Policy`, StatusCodes.FORBIDDEN))
  },

  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  //Cors se cho phep nhan cookies tu request (Dinh kiem jwt access token va refresh token vao httpOnly Cookies)
  credentials: true
}
