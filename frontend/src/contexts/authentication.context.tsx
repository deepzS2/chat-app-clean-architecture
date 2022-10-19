import { useContext, ReactNode, useState, createContext } from 'react'

import { User } from '@interfaces/index'
import api from '@services/api'

interface IAuthenticationValue {
	token?: string
	user?: User
}

interface IAuthenticationContext extends IAuthenticationValue {
	login: (email: string, password: string) => Promise<IAuthenticationValue>
	logout: () => void
}

const initialState: IAuthenticationValue = {
	token: undefined,
	user: undefined,
}

const AuthenticationContext = createContext<IAuthenticationContext>({
	...initialState,
	login: async () => null,
	logout: () => null,
})

export function AuthenticationProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<IAuthenticationValue>(initialState)

	const login = async (email: string, password: string) => {
		const { data } = await api.post<IAuthenticationValue>('/users/login', {
			email,
			password,
		})

		const stateResult = {
			token: data.token,
			user: data.user,
		}

		setState(stateResult)

		api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

		return stateResult
	}

	const logout = () => setState(initialState)

	return (
		<AuthenticationContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export const useAuthentication = () => useContext(AuthenticationContext)
