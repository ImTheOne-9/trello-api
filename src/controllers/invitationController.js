import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'
const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    // Dieu huong sang tang Service
    const result = await invitationService.createNewBoardInvitation(req.body, inviterId)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}


const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // Dieu huong sang tang Service
    const resInvitations = await invitationService.getInvitations(userId)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(resInvitations)
  } catch (error) {
    next(error)
  }
}

const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    // Dieu huong sang tang Service
    const updatedInvitation = await invitationService.updateBoardInvitation(userId, invitationId, status)
    // Co ket qua thi tra ve phia client
    res.status(StatusCodes.OK).json(updatedInvitation)
  } catch (error) {
    next(error)
  }
}
export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}