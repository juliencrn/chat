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
        <form onSubmit={sendMessage}>
            <input
                onChange={handleUpdate}
                required
                placeholder="Say hi!"
                value={input}
            />
            <br />

            <button type="submit">Send</button>
        </form>
    )
}

export default ChatForm