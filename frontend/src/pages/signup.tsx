import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'

import Button from '@components/Button'
import Input from '@components/Input'
import Layout from '@components/Layout'
import api from '@services/api'

interface FormData {
	username: string
	email: string
	password: string
}

const Signup: NextPage = () => {
	const router = useRouter()
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit = handleSubmit(async (data) => {
		try {
			const result = await api.post('/users', data)

			if (result.status === 201) {
				router.push('/login')
			}
		} catch (error) {
			console.error(error)
		}
	})

	return (
		<Layout title="Chat App | Register">
			<main className="w-full min-h-screen flex items-center justify-center">
				<form
					onSubmit={onSubmit}
					className="min-w-[752px] bg-white px-8 py-12 flex flex-col items-center gap-9"
				>
					<h3 className="font-poppins text-3xl font-bold text-primary-500 text-center w-full">
						Register
					</h3>

					<div className="flex flex-col items-center w-full gap-6">
						<div className="flex flex-col gap-2 w-full">
							<label
								className="font-poppins font-bold text-md text-neutral-900"
								htmlFor="username"
							>
								Username
							</label>
							<Controller
								name="username"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Input
										id="username"
										type="text"
										placeholder="Type your username..."
										{...field}
									/>
								)}
							/>
							{errors.email && (
								<span className="font-poppins text-sm text-red-600">
									{errors.username.type === 'required'
										? 'Field required'
										: errors.username.message}
								</span>
							)}
						</div>

						<div className="flex flex-col gap-2 w-full">
							<label
								className="font-poppins font-bold text-md text-neutral-900"
								htmlFor="email"
							>
								Email
							</label>
							<Controller
								name="email"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Input
										id="email"
										type="email"
										placeholder="Type your email..."
										{...field}
									/>
								)}
							/>
							{errors.email && (
								<span className="font-poppins text-sm text-red-600">
									{errors.email.type === 'required'
										? 'Field required'
										: errors.email.message}
								</span>
							)}
						</div>

						<div className="flex flex-col gap-2 w-full">
							<label
								className="font-poppins font-bold text-md text-neutral-900"
								htmlFor="password"
							>
								Password
							</label>
							<Controller
								name="password"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Input
										id="password"
										type="password"
										placeholder="Type your password..."
										{...field}
									/>
								)}
							/>
							{errors.password && (
								<span className="font-poppins text-sm text-red-600">
									{errors.password.type === 'required'
										? 'Field required'
										: errors.password.message}
								</span>
							)}
						</div>
					</div>

					<Button type="submit" variant="primary">
						Sign up
					</Button>
				</form>
			</main>
		</Layout>
	)
}

export default Signup
