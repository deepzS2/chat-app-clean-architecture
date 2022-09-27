import { AppProps } from 'next/app'
import { IoProvider } from 'socket.io-react-hook'

import { AuthenticationProvider } from '@contexts/authentication.context'

import '@styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthenticationProvider>
			<IoProvider>
				<Component {...pageProps} />
			</IoProvider>
		</AuthenticationProvider>
	)
}
