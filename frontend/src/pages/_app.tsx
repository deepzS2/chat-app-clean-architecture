import { AppProps } from 'next/app'
import { IoProvider } from 'socket.io-react-hook'

import { AuthenticationProvider } from '@contexts/authentication.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<AuthenticationProvider>
				<IoProvider>
					<Component {...pageProps} />
				</IoProvider>
			</AuthenticationProvider>
		</QueryClientProvider>
	)
}
