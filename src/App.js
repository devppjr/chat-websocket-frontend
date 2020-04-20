import React from 'react';
import './App.css';

import socketIOClient from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{}],
      author: '',
      nameAuthorDisabled: '',
      message: '',
      socket: null,
    };
    this.handleAuthor = this.handleAuthor.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    const socket = socketIOClient(
      process.env.REACT_APP_BACKEND_SOCKET || 'http://localhost:3333/'
    );

    socket.on('loadMessages', (messages) => {
      this.setState({
        messages: messages,
      });
      setTimeout(this.updateScroll(), 500);
    });

    socket.on('receiveMessage', (message) => {
      this.setState({
        messages: [
          ...this.state.messages,
          { author: message.author, message: message.message },
        ],
      });
      setTimeout(this.updateScroll(), 500);
    });

    this.setState({
      socket: socket,
    });
  }

  handleAuthor(event) {
    this.setState({
      author: event.target.value,
    });
  }
  handleMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }
  handleSendMessage(event) {
    event.preventDefault();
    this.setState({
      nameAuthorDisabled: 'disabled',
    });
    this.state.socket.emit('sendMessage', {
      author: this.state.author,
      message: this.state.message,
    });
  }

  updateScroll() {
    var element = document.getElementById('messageScroll');
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div>
        <form id="chat" onSubmit={this.handleSendMessage}>
          <input
            type="text"
            name="username"
            placeholder="Digite seu usuario"
            value={this.state.author}
            onChange={this.handleAuthor}
            required
            disabled={this.state.nameAuthorDisabled}
          />
          <div id="messageScroll" className="messages">
            {this.state.messages.map((msg, index) => (
              <p
                key={index++}
                className={msg.author === this.state.author ? 'right' : 'left'}
              >
                <strong>{msg.author} :</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            id="message"
            value={this.state.message}
            onChange={this.handleMessage}
            placeholder="Digite sua mensagem"
            maxLength="255"
            required
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    );
  }
}
