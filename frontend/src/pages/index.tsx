import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Button from '@components/Button'
import InputWithEmoji from '@components/InputWithEmoji'
import Layout from '@components/Layout'
import Loading from '@components/Loading'
import { useAuthentication } from '@contexts/authentication.context'
import { useSocket } from '@hooks/useSocket'
import { Message } from '@interfaces/index'
import api from '@services/api'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

const Index: NextPage = () => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { user, token } = useAuthentication()
	const [contentInput, setContentInput] = useState('')
	const socket = useSocket(token)

	const query = useQuery(
		['messages'],
		async () => (await api.get<Message[]>('/messages')).data
	)
	const messageMutation = useMutation(
		async (content: string) => await api.post('/messages', { content })
	)

	useEffect(() => {
		if (!user) {
			router.push('/login')
		}
	}, [router, user])

	useEffect(() => {
		const addMessageToQueryData = (message: Message) =>
			queryClient.setQueryData<Message[]>(['messages'], (data) => [
				...data,
				message,
			])

		socket?.on('MESSAGE_CREATED', addMessageToQueryData)
		socket?.on('USER_JOINED', addMessageToQueryData)

		return () => {
			socket?.off('MESSAGE_CREATED')
			socket?.off('USER_JOINED')
		}
	}, [queryClient, socket])

	return (
		<Layout title="Chat App">
			<main className="relative w-full px-[152px] min-h-screen flex flex-col items-center mb-4">
				<div className="max-h-[80vh] overflow-y-scroll w-full flex flex-col items-center gap-7">
					{query.isLoading || query.isError ? (
						<Loading />
					) : query.data.length ? (
						query.data.map((message) => (
							<div key={message.id} className="flex flex-col w-full gap-2">
								<div className="flex items-center">
									<span className="min-w-[176px] font-poppins font-bold text-base text-neutral-100">
										{message.author?.username ?? 'Server'}
									</span>
									<span className="min-w-[176px] font-poppins font-bold text-base text-neutral-100">
										{new Date(message.createdAt).toLocaleString()}
									</span>
								</div>
								<p className="font-poppins font-bold w-full text-neutral-100 text-xs">
									{message.content}
								</p>
							</div>
						))
					) : (
						<h1 className="font-poppins font-bold text-xl text-neutral-100">
							No messages yet :D
						</h1>
					)}
				</div>
				<div className="absolute px-[152px] bottom-0 w-full flex items-center gap-4">
					<div className="flex-[3]">
						<InputWithEmoji
							onAddEmoji={(emoji) =>
								setContentInput(`${contentInput}${emoji.native}`)
							}
							type="text"
							minLength={3}
							value={contentInput}
							onChange={(e) => setContentInput(e.target.value)}
						/>
					</div>
					<div className="min-w-[176px]">
						<Button
							onClick={() => messageMutation.mutate(contentInput)}
							variant="primary"
						>
							Send
						</Button>
					</div>
				</div>
			</main>
		</Layout>
	)
}

export default Index
