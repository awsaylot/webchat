package com.awsaylot.videochat.controllers;

import com.awsaylot.videochat.entities.WebsocketDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class WebsocketController {
    @Autowired SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/chat/room")
    public WebsocketDTO receiveMessage(@Payload WebsocketDTO message) {
        return message;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/chat/room")
    public WebsocketDTO addUser(@Payload WebsocketDTO message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }
}
