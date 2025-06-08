/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { slugify } from '~/utils/slugToString'

const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Goi den tang Model de xu ly luu newBoard vao database
    const createdBoard = await boardModel.createNew(userId, newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // Ban email, notification ve cho admin khi co 1 card moi duoc tao

    // Tra ket qua ve
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) throw new ApiError('Not found board!', StatusCodes.NOT_FOUND)

    //Clone board
    const resBoard = cloneDeep(board)

    // Dieu chinh lai data tra ve
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards
    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardInDifferentColumn = async (reqBody) => {
  try {
    // B1: Update cardOrderIds of prev Column
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })
    // B2: Update cardOrderIds of next Column
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })
    // B3: Update column Id of active card
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemPerPage, queryFilters) => {
  if (!page) page = DEFAULT_PAGE
  if (!itemPerPage) itemPerPage = DEFAULT_ITEMS_PER_PAGE

  const result = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemPerPage, 10), queryFilters)
  return result
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardInDifferentColumn,
  getBoards
}
