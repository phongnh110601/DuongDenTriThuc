package com.phongnh.ddtt.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongnh.ddtt.model.Game;
import com.phongnh.ddtt.model.Message;
import com.phongnh.ddtt.model.MessageType;
import com.phongnh.ddtt.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@Controller
public class GameController {
    @Autowired
    private Game game;

    @MessageMapping("/message")
    @SendTo("/test/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println(message);
        return game.processMessage(message);
    }
}
