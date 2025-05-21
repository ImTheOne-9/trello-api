import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(5).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 characters long',
      'string.max': 'Title length must be less than or equal to 5 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace',
    }),
    description: Joi.string().required().min(3).max(5).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description length must be at least 10 characters long',
      'string.max': 'Description length must be less than or equal to 200 characters long',
      'string.trim': 'Description must not have leading or trailing whitespace',
    })
  })

  try {
    console.log(req.body)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
    res.status(StatusCodes.CREATED).json({ message: 'POST from Validation: API create new board' })
  } catch (error) {
    console.log('Error: ', error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}
