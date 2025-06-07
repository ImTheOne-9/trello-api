/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/pickUser'


const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    const board = await boardModel.findOneById(reqBody.boardId)

    if (!inviter || !invitee || !board) {
      throw new ApiError('Inviter, invitee or board not found')
    }
    const boardOwnerMemberIds = [...board.ownerIds, ...board.memberIds].toString()
    if (!boardOwnerMemberIds.includes(inviter._id.toString())) {
      throw new ApiError('You dont have permission to invite a user to this board!', StatusCodes.FORBIDDEN)
    }

    if (inviter._id.toString() === invitee._id.toString()) {
      throw new ApiError('Oops! You are inviting yourself!', StatusCodes.NOT_ACCEPTABLE)
    }

    if (boardOwnerMemberIds.includes(invitee._id.toString())) {
      throw new ApiError('The user of this email has already joined this board!', StatusCodes.NOT_ACCEPTABLE)
    }

    const existInvitation = await invitationModel.findByInviteeAndBoard(invitee._id, board._id)
    if (existInvitation) {
      throw new ApiError('Oops! This email has been invited!', StatusCodes.NOT_ACCEPTABLE)
    }
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }

    return resInvitation
  } catch (error) {
    throw error
  }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)
    console.log(getInvitations)

    const resInvitations = getInvitations.map(i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))
    return resInvitations
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) throw new ApiError('Invitation not found!', StatusCodes.NOT_FOUND)

    const boardId = getInvitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) throw new ApiError('Board not found!', StatusCodes.NOT_FOUND)

    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError('You are already a member of this board!', StatusCodes.NOT_ACCEPTABLE)
    }

    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }

    const updatedBoardInvitation = await invitationModel.update(invitationId, updateData)
    if (updatedBoardInvitation.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(boardId, userId)
    }
    return updatedBoardInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
