/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		fontFamily: {
			poppins: ['"Poppins"', 'sans-serif'],
		},
		extend: {
			colors: {
				primary: {
					100: '#595cb7',
					200: '#4447ae',
					300: '#2f33a5',
					400: '#2a2e95',
					500: '#262984',
				},
				secondary: {
					100: '#64a257',
					200: '#509742',
					300: '#3d8b2d',
					400: '#377d29',
					500: '#316f24',
				},
				neutral: {
					100: '#eaeaea',
					200: '#bfbfbf',
					300: '#555553',
					400: '#3f3f3e',
					500: '#2a2a28',
					600: '#262624',
					700: '#222220',
					800: '#1d1d1c',
					900: '#191918',
				},
			},
		},
	},
	plugins: [],
}
