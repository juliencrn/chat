import React, { ChangeEvent, FormEvent, useState } from "react";

export interface ChatFormProps {
  onMessage: (text: string) => void;
}

function ChatForm({ onMessage }: ChatFormProps) {
  const [input, setInput] = useState("");

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }

    onMessage(text);
    setInput("");
  };

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form
      onSubmit={sendMessage}
      className="flex absolute bottom-0 left-0 w-full "
    >
      <input
        className="flex-1 shadow-sm py-2 px-4 text-sm rounded-md border border-gray-400 focus:border-gray-700 resize-none outline-none my-3 mx-6 placeholder-gray-600"
        placeholder="Message..."
        onChange={handleUpdate}
        value={input}
      />
    </form>
  );
}

export default ChatForm;
