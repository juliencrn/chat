import React, { ChangeEvent, FormEvent, useState } from 'react'

export interface ChatFormProps {
    onMessage: (text: string) => void
}

function ChatForm({ onMessage }: ChatFormProps) {
    const [input, setInput] = useState("")

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()
        const text = input.trim()
        if (!text) {
            return
        }

        onMessage(text)
        setInput("")
    }

    const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    return (
        <form onSubmit={sendMessage} className="flex p-3">
            <input
                className="flex-1 shadow-sm py-2 px-4 rounded-md border border-gray-300 focus:border-gray-400 resize-none outline-none"
                placeholder="Message..."
                onChange={handleUpdate}
                autoFocus
                value={input}
            />
        </form>
    )
}

export default ChatForm