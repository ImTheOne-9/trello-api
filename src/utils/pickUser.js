import { pick } from 'lodash'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, [
    '_id', 'email', 'userName', 'displayName', 'avatar', 'role', 'isActive', 'createAt', 'updateAt'
  ])
}