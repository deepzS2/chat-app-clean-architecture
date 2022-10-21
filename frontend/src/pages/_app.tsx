import { AppProps } from 'next/app'

import { AuthenticationProvider } from '@contexts/authentication.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
			},
		},
	})

	return (
		<QueryClientProvider client={queryClient}>
			<AuthenticationProvider>
				<Component {...pageProps} />
			</AuthenticationProvider>
		</QueryClientProvider>
	)
}
