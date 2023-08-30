package com.example.backend.controller;

import com.example.backend.model.Message;
import com.example.backend.model.MessageType;
import com.example.backend.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class GameController {

    public static List<User> users = new ArrayList<>();
    private static boolean isAllowAnswer = true;
    private static Timer timer = new Timer();
    private static int time;

    private int currentRound = 1;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/test/public")
    public Message receiveMessage(@Payload Message message) {
        long start = System.nanoTime();
        try {
            message.setReceivedTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()));
            System.out.println(message);
            if (message.getType() == MessageType.JOIN) {
                message.setMessage(new ObjectMapper().writeValueAsString(users));
            } else if (message.getType() == MessageType.UPDATE){
                users = new ObjectMapper().readValue(message.getMessage(), new TypeReference<List<User>>(){});
            }
            else if (currentRound == 1){
                return startRound(message);
            }

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        long end = System.nanoTime();
        System.out.println("Processing time: " + (end - start)/1000000 + " ms");
        return message;
    }

    private Message startRound(Message message) throws JsonProcessingException {
        System.out.println("Start round");
        if (message.getType() == MessageType.ANSWER) {
            if (isAllowAnswer) {
                isAllowAnswer = false;
                System.out.println("Allow answer");
                User user = findUserByName(message.getMessage());
                user.setAnswering(true);
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                simpMessagingTemplate.convertAndSend("/test/public", message);
                time = 3;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            } else {
                return null;
            }
        }
        if (message.getType() == MessageType.QUESTION) {
            isAllowAnswer = true;
        }

        if (message.getType() == MessageType.COUNT) {
            if (isAllowAnswer) {
                time = 3;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            }
        }
        return message;
    }

    private void countdown(Message message) {
        System.out.println("Start count down");
        System.out.println("Time: " + time);
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                System.out.println(time);
                if (time <= 0) {
                    timer.cancel();
                    isAllowAnswer = false;
                    System.out.println("End count");
                }
                message.setMessage(String.valueOf(time));
                message.setType(MessageType.TIME);
                simpMessagingTemplate.convertAndSend("/test/public", message);
                time--;
            }
        }, 1000, 1000);
    }

    private User findUserByName(String name){
        for (User user :
                users) {
            if (user.getName().equals(name)) {
                return user;
            }
        }
        return null;
    }

    private User findUserBySessionId(String sessionId) {
        for (User user :
                users) {
            if (user.getSessionId().equals(sessionId)) {
                return user;
            }
        }
        return null;
    }

    public void deleteUserBySessionId(String sessionId) {
        User user = findUserBySessionId(sessionId);
        if (user != null) {
            users.remove(user);
        }
    }

    public void addUser(String name, String sessionId) {
        users.add(new User(name, 0, false, sessionId));
    }

    public void updateUsersToClient() {
        Message message = new Message();
        try {
            message.setMessage(new ObjectMapper().writeValueAsString(users));
            message.setType(MessageType.UPDATE);
            simpMessagingTemplate.convertAndSend("/test/public", message);
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
        }
    }

}
