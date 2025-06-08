/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { date } from 'joi'
import { cloneDeep } from 'lodash'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
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

const update = async (cardId, userInfo, reqBody, cardCoverFile) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    let updatedCard ={}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
        updateAt: Date.now()
      })
    } else if (updateData.commentToAdd) {
      //Tao du lieu comment them vao db, can bo sung them nhung field can thiet
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }

      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateData.inComingMemberInfo) {
      // Truong hop Add hoac Remove thanh vien ra khoi card
      updatedCard = await cardModel.updateMember(cardId, updateData.inComingMemberInfo)
    }
    else {
      updatedCard = await cardModel.update(cardId, updateData)
    }
    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
