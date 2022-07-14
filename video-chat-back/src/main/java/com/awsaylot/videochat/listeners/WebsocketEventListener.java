package com.awsaylot.videochat.listeners;

import com.awsaylot.videochat.entities.WebsocketDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebsocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebsocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebsocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebsocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        logger.info("Someone disconnected");
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username!= null) {
            logger.info("User Disconnected : " + username);

            WebsocketDTO message = new WebsocketDTO();
            message.setType(WebsocketDTO.MessageType.LEAVE);
            message.setSender(username);

            messagingTemplate.convertAndSend("/chat/room", message);
        }
    }
}
