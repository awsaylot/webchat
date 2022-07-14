import {Client} from '@stomp/stompjs'
import store from '../store'
import { receiveMessage } from "../actions/chatActions/chat";


class WebsocketService {
	SOCKET_URL = "ws://localhost:8080/ws-message"
	socketClient = null
	state = store.getState()
	connect = () => {
		const username = this.state.auth.user.username
		let onConnected = () => {
			console.log("Connected to chat")
			client.subscribe('/chat/room', (msg) => this.receiveMessage(msg))
		}

		let onDisconnected = () => {
			console.log("Disconnected from the chat")
		}

		const client = new Client({
			brokerURL: this.SOCKET_URL,
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: onConnected,
			onDisconnect: onDisconnected
		})

		client.activate()
		this.socketClient = client
	}

	disconnect = () => {
		console.log('disconnected')
		this.socketClient.deactivate()
		this.socketClient = null
	}

	sendMessage = (payload) => {
		const username = this.state.auth.user.username
		var messageToSend = JSON.stringify({
			'type': "CHAT",
			'message':payload,
			'sender': username
		})
		if (!this.socketClient) {
			alert('You must connect first!')
		} else {
			this.socketClient.publish({
				destination: '/app/chat.sendMessage',
				body: messageToSend
			})
		}
	}

	receiveMessage = (payload) => {
		const message = JSON.parse(payload.body)
		store.dispatch(receiveMessage(message))
	}
}

export default new WebsocketService();
