import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createdColumn = await columnService.createNew(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const columnId = req.params.id
    const updatedColumn = await columnService.update(columnId, req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(updatedColumn)
  } catch (error) {
    next(error)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const columnId = req.params.id
    const result = await columnService.deleteItem(columnId)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
  update,
  deleteItem
}