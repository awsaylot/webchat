import React, { useCallback, useRef, useState } from 'react'

import {Client} from '@stomp/stompjs'

export default function ChatRoom() {
	const SOCKET_URL = "ws://localhost:8080/ws-message"
	
	const [client, setClient] = useState(null);
	const [connected, setConnected] = useState(false);

	const videoRef = useRef(null)

	const startVideo = (e) => {
		e.preventDefault()
		navigator.mediaDevices
			.getUserMedia({video: {width: 300}})
			.then(stream => {
				let video = videoRef.current
				video.srcObject = stream;
				video.play()
			})
			.catch(err => {
				console.error("error: ", err)
			})
	}

	const stopVideo = (e) => {
		e.preventDefault()
		videoRef.current.srcObject = null;
	}

	const connect = () => {
		let onConnected = () => {
			console.log("Connected to chat")
			setConnected(true)
			client.subscribe('/chat/room', (msg) => console.log(JSON.parse(msg.body)))
		}

		let onDisconnected = () => {
			console.log("Disconnected from the chat")
			setConnected(false)
		}

		const client = new Client({
			brokerURL: SOCKET_URL,
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: onConnected,
			onDisconnect: onDisconnected
		})

		client.activate()
		setClient(client)
	}

	const handleConnect = (e) => {
		e.preventDefault()
		connect()
	}

	const handleDisconnect = (e) => {
		e.preventDefault()
		client.deactivate();
	}

	const sendMessage = (type, payload) => {
		var messageToSend = JSON.stringify({
			'type': type,
			'message': payload,
			'sender': 'michael'
		})
		if (!connected) {
			alert('You must connect first!')
		} else {
			client.publish({
				destination: '/app/chat.sendMessage',
				body: messageToSend
			})
		}
	}

  return (
	<>
		<button onClick={handleConnect}>Connect</button>
		<button onClick={handleDisconnect}>Disconnect</button>
		<button onClick={() => sendMessage('CHAT', 'test')}>Send test Message</button>
		<p>{connected}</p>
		<button onClick={startVideo}>Start Video</button>
		<button onClick={stopVideo}>Stop Video</button>
		<video ref={videoRef} />
	</>
  )
}
