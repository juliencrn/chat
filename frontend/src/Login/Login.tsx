import React, { FormEvent, useState } from 'react';

export interface LoginProps {
    onSuccess: (username: string) => void
}

function Login({ onSuccess }: LoginProps) {
  const [input, setInput] = useState("Julien");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) {
      return alert("Name can't be empty");
    }
    onSuccess(input);
  };

  return (
    <div className="flex flex-1 flex-col">
        <div className="m-auto pb-12 p-3 text-center">
            <h1 className="font-bold text-4xl tracking-wide mb-2">Welcome to the Chat!</h1>
            <p className="text-xl text-gray-500 mb-2">What is your name?</p>

            <form onSubmit={handleSubmit} className="flex flex-col">
            <input
                onChange={e => setInput(e.target.value.trim())}
                required
                placeholder="My username"
                className="flex-1 shadow-sm py-2 px-4 rounded-md border border-gray-300 focus:border-gray-400 resize-none outline-none"
                value={input}
            />

            <button type="submit" className="mt-2 shadow-sm bg-gray-200 rounded-md py-2 px-4">Enter</button>
            </form>
        </div>
    </div>
  );
}

export default Login;
