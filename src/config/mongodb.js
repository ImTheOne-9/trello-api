//viethoangdev
//LdMXHE7vM4eF7o5n
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

const uri = env.MONGODB_URI
const DATABASE_NAME = env.DATABASE_NAME

// Khoi tao 1 doi tuong database = null ( vi chua connect )
let trelloDatabaseInstance = null

// Khoi tao 1 doi tuong client de connect toi mongodb
const mongoClientInstance = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // Connect the client to the server
  await mongoClientInstance.connect()

  // Sau khi connect thi lay database theo ten va gan nguoc no vao trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  // Close the client to the server
  await mongoClientInstance.close()
}

// Export ra trelloDatabaseInstance sau khi connect thanh cong den MongoDb de su dung o nhieu noi
// Phai dam bao chi luon goi GET_DB sau khi connect thanh cong den MongoDb
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')
  return trelloDatabaseInstance
}

