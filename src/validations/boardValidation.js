/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 characters long',
      'string.max': 'Title length must be less than or equal to 50 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace',
    }),
    description: Joi.string().required().min(10).max(200).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description length must be at least 10 characters long',
      'string.max': 'Description length must be less than or equal to 200 characters long',
      'string.trim': 'Description must not have leading or trailing whitespace',
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorDetails = error?.details?.map(err => err.message) || ['Validation failed']
    console.log('Error: ', errorDetails)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: errorDetails
    })
  }
}

export const boardValidation = {
  createNew
}
