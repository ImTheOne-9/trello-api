import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // Dieu huong sang tang Service
    const createdBoard = await boardService.createNew(userId, req.body)
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
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await boardService.getDetails(userId, boardId)

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

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemPerPage } = req.query
    const result = await boardService.getBoards(userId, page, itemPerPage)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}


export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardInDifferentColumn,
  getBoards
}