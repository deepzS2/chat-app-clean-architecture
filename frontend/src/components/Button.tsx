import { ButtonHTMLAttributes, DOMAttributes, ReactNode } from 'react'

type Props = DOMAttributes<HTMLButtonElement> &
	ButtonHTMLAttributes<HTMLButtonElement> & {
		children?: ReactNode
		variant: 'primary' | 'secondary'
	}

const Button = ({ children, variant, onClick }: Props) => {
	return (
		<button
			onClick={onClick}
			className={`w-full ${
				variant === 'primary' ? 'bg-primary-300' : 'bg-secondary-300'
			} text-neutral-100 px-[10px] py-2 text-center font-poppins font-bold text-xl`}
		>
			{children}
		</button>
	)
}

export default Button
