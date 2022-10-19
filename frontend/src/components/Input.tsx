import { HTMLAttributes, InputHTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLInputElement> &
	InputHTMLAttributes<HTMLInputElement>

const Input = (props: Props) => {
	return (
		<input
			className="w-full font-poppins text-neutral-900 bg-neutral-100 border-[1px] border-neutral-200 px-4 py-2 text-base"
			{...props}
		/>
	)
}

export default Input
