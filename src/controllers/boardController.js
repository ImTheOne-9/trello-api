import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createdBoard = await boardService.createNew(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const moveCardInDifferentColumn = async (req, res, next) => {
  try {
    const updatedBoard = await boardService.moveCardInDifferentColumn(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardInDifferentColumn
}