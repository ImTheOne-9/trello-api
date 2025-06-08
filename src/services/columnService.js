/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/slugToString'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    // Goi den tang Model de xu ly luu newcolumn vao database
    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnToColumnOrderIds(getNewColumn)
    }
    // Ban email, notification ve cho admin khi co 1 card moi duoc tao

    // Tra ket qua ve
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    // console.log(targetColumn)
    // Delete Column
    await columnModel.deleteOneById(columnId)
    // Delete cards of deleted column
    await cardModel.deleteCardsByColumnId(columnId)
    await boardModel.pullColumnFromColumnOrderIds(targetColumn)
    return { deleteResult: 'This Column is deleted successfully' }
  } catch (error) {
    throw error
  }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}
