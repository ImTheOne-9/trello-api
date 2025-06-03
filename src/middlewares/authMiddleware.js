import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

//Xac thuc Jwt Access Token tu nphia FE co hop le khong
const isAuthorized = async(req, res, next) => {
  // Lay accessToken trong request cookie phia client - withCredentials trong authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError('Authorized: (token not found)', StatusCodes.UNAUTHORIZED ))
    return
  }

  try {
    // Thuc hien giai ma Token ra xem co hop le khong
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_PRIVATE_KEY)
    // console.log(accessTokenDecoded)
    // Neu hop le, luu thong tin giai ma duoc vao req, jwtDecoded de su dung cho cac tang can xu li phia sau
    req.jwtDecoded = accessTokenDecoded
    // Cho phep req di tiep
    next()
  } catch (error) {
    // console.log(error)
    // Neu access token bi het han (expired) => tra ve ma loi cho FE de goi api RefreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError('Need to refresh token', StatusCodes.GONE ))
      return
    }

    // Neu accessToken khong hop le do bat ki dieu gi khac thi tra ve ma loi 401 cho phia FE va sign_out luon
    next(new ApiError('Unauthorized', StatusCodes.UNAUTHORIZED ))
  }
}

export const authMiddleware = {
  isAuthorized
}