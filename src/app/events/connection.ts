import { Server, Socket } from 'socket.io'

export const onConnection = async (io: Server, socket: Socket) => {
	socket.broadcast.emit('USER_JOINED', {
		content: `${socket.user.username} joined the chat!`,
	})
}
