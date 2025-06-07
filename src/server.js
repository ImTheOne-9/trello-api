/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { handleErrorMiddleware } from '~/middlewares/handlleErrorMiddleware'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import socketIo from 'socket.io'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'
const START_SERVER = () => {
  const app = express()

  // Fix cache from disk ExpressJs
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  // Config Cookie
  app.use(cookieParser())

  app.use(cors(corsOptions))

  //Enable req.bode json data
  app.use(express.json())

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.use('/v1', APIs_V1)

  app.use(handleErrorMiddleware)

  const server = http.createServer(app)

  // Khoi tao bien io vsverver va cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    //Lang nghe su kien client emit len
    inviteUserToBoardSocket(socket)
  })

  server.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at http://${hostname}:${port}/`)
  })


  exitHook(() => {
    console.log('Disconnecting from MongoDB...')
    CLOSE_DB()
    console.log('Disconnected from MongoDB!')
  })
}
// Chi khi connect toi database thanh cong moi Start Server Back-end len
// IIFE
(async () => {
  try {
    console.log('Connecting to MongoDb Cloud Atlas!')
    await CONNECT_DB()
    console.log('Connected to MongoDb Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()