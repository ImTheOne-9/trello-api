/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/slugToString'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/pickUser'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

const createNew = async (reqBody) => {
  try {
    // Check if the email already exists in the system
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError('Email already exists', StatusCodes.CONFLICT)
    }
    // Create Data to save in database
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 8),
      userName: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // Save user data in to data base
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Send an email to the user to verify their account
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello Web: Please verify your email before using our services!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - Viethoangdev - Developer - </h3>
    `
    // Goi toi cai Provider gui mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    // return tra ve du lieu cho controller
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async(reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError('Account not found!', StatusCodes.NOT_FOUND)

    if (existUser.isActive) throw new ApiError('Your account is already active!', StatusCodes.NOT_ACCEPTABLE)

    if (reqBody.token !== existUser.verifyToken) throw new ApiError('Token is invalid!', StatusCodes.NOT_ACCEPTABLE)

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError('Account not found!', StatusCodes.NOT_FOUND)

    if (!existUser.isActive) throw new ApiError('Your account is not active!', StatusCodes.NOT_ACCEPTABLE)

    if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError('Your email or password is incorrect!', StatusCodes.NOT_ACCEPTABLE)
    }

    /** Neu moi thu ok thi bat dau tao Token dang nhap de tra ve cho phia FE */
    // Tao thong tin dinh kem trong JWT Token
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }

    // Tao ra 2 loai token: accessToken va refreshToken tra ve FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      //5
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      //15
      env.REFRESH_TOKEN_LIFE
    )

    // tra ve thong tin ng dung kem 2 token
    return { accessToken, refreshToken, ...pickUser(existUser) }

  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Giai ma refreshToken xem co hop le khong
    console.log(clientRefreshToken)
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_PRIVATE_KEY)
    console.log('refreshTokenDecoded', refreshTokenDecoded)
    /** Neu moi thu ok thi bat dau tao Token dang nhap de tra ve cho phia FE */
    // Tao thong tin dinh kem trong JWT Token
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // Tao ra 2 loai token: accessToken va refreshToken tra ve FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      //5
      env.ACCESS_TOKEN_LIFE
    )
    console.log(accessToken)
    return { accessToken }

  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken
}
