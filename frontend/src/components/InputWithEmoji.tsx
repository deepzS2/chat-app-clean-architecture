import { BaseEmoji } from 'emoji-mart'
import {
	HTMLAttributes,
	InputHTMLAttributes,
	forwardRef,
	useState,
} from 'react'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type Props = HTMLAttributes<HTMLInputElement> &
	InputHTMLAttributes<HTMLInputElement> & {
		onAddEmoji?: (emoji: BaseEmoji) => any
	}

const EmojiIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="w-6 h-6 text-neutral-900"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
)

const InputWithEmoji = forwardRef<HTMLInputElement, Props>((props, ref) => {
	const [showEmojis, setShowEmojis] = useState(false)

	const onEmojiSelect = (emoji: BaseEmoji) => {
		setShowEmojis(false)
		props.onAddEmoji?.(emoji)
	}

	return (
		<div className="relative">
			<input
				ref={ref}
				className="w-full font-poppins text-neutral-900 bg-neutral-100 border-[1px] border-neutral-200 px-4 py-2 text-base"
				{...props}
			/>
			<button
				className="absolute right-3 top-1/2 -translate-y-1/2"
				onClick={() => setShowEmojis(true)}
			>
				<EmojiIcon />
			</button>
			{showEmojis && (
				<div className="absolute -bottom-[100%] right-3">
					<Picker data={data} theme="dark" onEmojiSelect={onEmojiSelect} />
				</div>
			)}
		</div>
	)
})

InputWithEmoji.displayName = 'InputWithEmoji'

export default InputWithEmoji
