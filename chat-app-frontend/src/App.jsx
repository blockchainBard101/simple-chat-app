import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3003', {
  transports: ['websocket'],
});

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onUserJoined(data) {
      setMessages(prev => [...prev, { type: 'system', content: `${data.message} (ID: ${data.id})` }]);
    }

    function onUserLeft(data) {
      setMessages(prev => [...prev, { type: 'system', content: `${data.message} (ID: ${data.id})` }]);
    }

    function onMessage(data) {
      console.log('Received message from server:', data);
      setMessages(prev => [...prev, { type: 'message', content: data }]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    // backend emits 'reply-message' in response to 'message'
    socket.on('reply-message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('reply-message', onMessage);
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim()) {
      // Optimistically add our own message? 
      // The backend doesn't seem to broadcast the user's *own* message back to them as a 'reply-message' 
      // with the same content (it sends "Hello world!"). 
      // Looking at the gateway: 
      // client.emit('reply-message', "Hello world!");
      // this.server.emit('reply-message', "Hello world!sbsujbsbsb");

      // So if I send "Hi", the backend sends "Hello world!" to me and "Hello world!sbsujbsbsb" to everyone.
      // We should probably display what we sent.
      setMessages(prev => [...prev, { type: 'self', content: inputValue }]);
      socket.emit('message', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>React WebSocket Chat</h1>
        <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? `Connected (${socket.id})` : 'Disconnected'}
        </div>
      </header>

      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-item ${msg.type}`}>
            <span className="message-content">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
