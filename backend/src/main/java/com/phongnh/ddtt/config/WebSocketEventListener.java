package com.phongnh.ddtt.config;
import com.phongnh.ddtt.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    @Autowired
    private Game game;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        System.out.println(event.getMessage().getHeaders());
        MessageHeaderAccessor headerAccessor =
                MessageHeaderAccessor.getAccessor(event.getMessage().getHeaders(),
                        MessageHeaderAccessor.class);
        StompHeaderAccessor stompHeaderAccessor = MessageHeaderAccessor.getAccessor(
                (Message<?>) headerAccessor.getHeader("simpConnectMessage"),
                StompHeaderAccessor.class) ;
        String name = stompHeaderAccessor.getNativeHeader("name").get(0);
        if (!name.equals("host") && !name.equalsIgnoreCase("viewer")){
            String sessionId = stompHeaderAccessor.getSessionId();
            game.addUser(name, sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        System.out.println(event.getMessage().getHeaders());
        String sessionId = event.getSessionId();
        game.deleteUserBySessionId(sessionId);
        game.updateUsersToClient();
    }
}
