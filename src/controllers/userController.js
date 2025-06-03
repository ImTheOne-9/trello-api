import { StatusCodes } from 'http-status-codes'
import { sampleSize } from 'lodash'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createdUser = await userService.createNew(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const result = await userService.verifyAccount(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const result = await userService.login(req.body)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14d')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14d')
    })
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    console.log('Refresh Token cookie:', req.cookies?.refreshToken)
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14d')
    })
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(result.accessToken)
  } catch (error) {
    next(new ApiError('Please Sign In! (Error from access token)', StatusCodes.FORBIDDEN))
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}
export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken
}