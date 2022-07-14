import React, { Component } from 'react'
import WebsocketService from '../../services/websocket.service'

export default class ChatRoom extends Component {
	constructor(props) {
		super(props)
		this.state = {
			connected: false,
		}

		this.handleConnect = this.handleConnect.bind(this)
		this.handleDisconnect = this.handleDisconnect.bind(this)
	}

	handleConnect = (e) => {
		e.preventDefault()
		WebsocketService.connect()
		this.setState({connected: true})
	}

	handleDisconnect = (e) => {
		e.preventDefault()
		WebsocketService.disconnect()
		this.setState({connected: false})
	}
	
  render() {
	return (
	  <div>
		<button onClick={this.handleConnect}>Connect</button>
		<button onClick={this.handleDisconnect}>Disconnect</button>
		<button onClick={() => WebsocketService.sendMessage('CHAT', 'test')}>Send test Message</button>
		<p>{this.connected}</p>
	  </div>
	)
  }
}


