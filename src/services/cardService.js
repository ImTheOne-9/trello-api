/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/slugToString'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    // Goi den tang Model de xu ly luu newcard vao database
    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    // Ban email, notification ve cho admin khi co 1 card moi duoc tao
    if (getNewCard) {
      await columnModel.pushCardToCardOrderIds(getNewCard)
    }
    // Tra ket qua ve
    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
