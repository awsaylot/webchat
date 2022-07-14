import React from 'react'
import { useSelector } from 'react-redux'
import "./Messages.css"

export default function Messages() {
  const messages = useSelector((state) => state.chat.messages)
  const messageBox = messages.map((msg, i) => 
  <div key={i} className="message-card">
    <div className='sender'>
      {msg.sender}
    </div>
    <div className='message'>
      {msg.message}
    </div>
  </div>
)
 
  return (
	<div className="message-box">{messageBox}</div>
  )
}
