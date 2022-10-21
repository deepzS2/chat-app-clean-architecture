import { HTMLAttributes, InputHTMLAttributes, forwardRef } from 'react'

type Props = HTMLAttributes<HTMLInputElement> &
	InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
	return (
		<input
			ref={ref}
			className="w-full font-poppins text-neutral-900 bg-neutral-100 border-[1px] border-neutral-200 px-4 py-2 text-base"
			{...props}
		/>
	)
})

Input.displayName = 'Input'

export default Input
