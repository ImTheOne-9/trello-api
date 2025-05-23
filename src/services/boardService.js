/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/slugToString'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Goi den tang Model de xu ly luu newBoard vao database
    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // Ban email, notification ve cho admin khi co 1 card moi duoc tao

    // Tra ket qua ve
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Not found board!')
    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
