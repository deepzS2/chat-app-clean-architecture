import Link from 'next/link'
import React from 'react'

import { useAuthentication } from '@contexts/authentication.context'

const Header = () => {
	const { token, logout } = useAuthentication()

	return (
		<header className="py-12 px-[152px] flex items-center justify-between">
			<h3 className="font-poppins font-bold text-3xl text-secondary-100">
				Chat <span className="text-primary-100">App</span>
			</h3>

			<div className="flex items-center gap-4">
				{token ? (
					<a
						href="#"
						onClick={logout}
						className="font-poppins text-xl text-center text-neutral-100 w-[80px]"
					>
						Logout
					</a>
				) : (
					<>
						<Link href="/login" passHref>
							<a className="font-poppins text-xl text-center text-neutral-100 w-[80px]">
								Login
							</a>
						</Link>
						<Link href="/signup" passHref>
							<a className="font-poppins text-xl text-center text-neutral-100 w-[80px]">
								Signup
							</a>
						</Link>
					</>
				)}
			</div>
		</header>
	)
}

export default Header
