import React, { Component } from 'react'
import WebsocketService from '../../services/websocket.service'
import InputBox from './InputBox'
import Messages from './Messages'
import "./ChatRoom.css"

export default class ChatRoom extends Component {
	constructor(props) {
		super(props)
		this.state = {
			connected: false,
		}

		this.handleConnect = this.handleConnect.bind(this)
		this.handleDisconnect = this.handleDisconnect.bind(this)
	}

	componentDidMount() {
		this.handleConnect()
	}
	componentWillUnmount() {
		this.handleDisconnect()
	}

	handleConnect = (e) => {
		WebsocketService.connect()
		this.setState({connected: true})
	}

	handleDisconnect = (e) => {
		WebsocketService.disconnect()
		this.setState({connected: false})
	}
	
  render() {
	return (
	  <div className='chatroom'>
		<h3>Chatroom!</h3>
		<Messages />
		<InputBox />
	  </div>
	)
  }
}


