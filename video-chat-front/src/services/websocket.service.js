import {Client} from '@stomp/stompjs'



class WebsocketService {
	SOCKET_URL = "ws://localhost:8080/ws-message"
	socketClient = null
	connect = () => {
		let onConnected = () => {
			console.log("Connected to chat")
			client.subscribe('/chat/room', (msg) => console.log(JSON.parse(msg.body)))
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

	sendMessage = (type, payload) => {
		var messageToSend = JSON.stringify({
			'type': type,
			'message': payload,
			'sender': 'michael'
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
}

export default new WebsocketService();
