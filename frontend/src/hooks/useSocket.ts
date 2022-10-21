import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = (token: string) => {
	const socket = useRef<Socket>()

	useEffect(() => {
		socket.current = io('http://localhost:8080/', {
			auth: {
				token,
			},
		})
	}, [token])

	return socket.current
}
