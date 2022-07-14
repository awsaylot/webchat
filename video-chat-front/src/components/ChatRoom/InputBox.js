import React, { useState } from 'react'
import WebsocketService from "../../services/websocket.service"
import "./InputBox.css"

export default function InputBox() {
	const [message, setMessage] = useState("")


	const handleMessage = (e) => {
		setMessage(e.target.value)
	}

	const sendMessage = (e) => {
		e.preventDefault()
		WebsocketService.sendMessage(message)
		setMessage("")
	}
  return (
	<div className='input-box'>
		<form onSubmit={sendMessage}>
			<input className='input-message' type="text" value={message} onChange={handleMessage} />
			<input className='send-message' type="submit" value="Send" />
		</form>
	</div>
  )
}
