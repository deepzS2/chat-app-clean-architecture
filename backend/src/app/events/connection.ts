import { Server, Socket } from 'socket.io'

import { Message } from '@entities/message'
import { MessageDTO } from '@use-cases/messages/dto/message-dto'

export const onConnection = (io: Server, socket: Socket) => {
	const messageResult = Message.create({
		content: `${socket.user.username} joined the chat!`,
		authorId: socket.user.id,
	})

	if (messageResult.isSuccess) {
		const message = messageResult.getValue()

		socket.broadcast.emit('USER_JOINED', MessageDTO.fromEntity(message))
	}
}
