import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createdCard = await cardService.createNew(req.body)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    // Dieu huong sang tang Service
    const updatedCard = await cardService.update(cardId, req.body, cardCoverFile)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(updatedCard)
  } catch (error) {
    next(error)
  }
}


export const cardController = {
  createNew,
  update
}