/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/slugToString'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Goi den tang Model de xu ly luu newBoard vao database

    // Ban email, notification ve cho admin khi co 1 card moi duoc tao

    // Tra ket qua ve
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
