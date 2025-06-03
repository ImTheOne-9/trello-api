import JWT from 'jsonwebtoken'

/**
 * Function tao moi 1 token: 3 tham so dau vao
 * userInfo: thong tin muon dinh kem vao token
 * privateKey: Chu ky bi mat (string ngau nhien)
 * tokenLife: thoi gian song cua token
 */
const generateToken = async (userInfo, privateKey, tokenLife) => {
  try {
    return JWT.sign(userInfo, privateKey, { algorithm: 'HS256', expiresIn: tokenLife})
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Kiem tra xem 1 token co hop le khong
 */
const verifyToken = async (token, privateKey) => {
  try {
    // Ham verify cua thu vien jwt
    return JWT.verify(token, privateKey)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}