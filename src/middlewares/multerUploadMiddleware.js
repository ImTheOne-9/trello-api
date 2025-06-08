import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validate'

// Function kiem tra loai file

const customFileFilter = (req, file, cb) => {
  // console.log('multerfile: ', file)

  // Doi voi multer kiem tra kieu file thi su dung mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return cb(new ApiError(errMessage, StatusCodes.UNPROCESSABLE_ENTITY), null)
  }

  // Neu kieu file hop le
  return cb(null, true)
}

// Khoi tao function upload duoc boc boi multer
const upload = multer({
  limits: { fieldSize: LIMIT_COMMON_FILE_SIZE},
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = {
  upload
}