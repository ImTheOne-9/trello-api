export const inviteUserToBoardSocket = (socket) => {
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}
