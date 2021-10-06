import React, { FormEvent, useState } from 'react';

import './App.css';
import Chat from './Chat';

function App() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username) {
      return alert("Name can't be empty");
    }
    setUserId(username);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!userId ? (
          <div>
            <h2>Hello!</h2>

            <form onSubmit={handleSubmit}>
              <input
                id="name"
                onChange={e => setUsername(e.target.value.trim())}
                required
                placeholder="What is your name .."
                value={username}
              />
              <br />

              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <Chat username={username} />
        )}
      </header>
    </div>
  );
}

export default App;
