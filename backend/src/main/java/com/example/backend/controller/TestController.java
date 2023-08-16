package com.example.backend.controller;

import com.example.backend.model.Message;
import com.example.backend.model.Type;
import com.example.backend.model.User;
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
public class TestController {

    private static List<User> users = new ArrayList<>();
    private static boolean isAllowAnswer = true;
    private static Timer timer = new Timer();
    private static int time;

    private User currentUser;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/test/public")
    public Message receiveMessage(@Payload Message message){
        try{
            message.setReceivedTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()));
            System.out.println(message);
            if (message.getType() == Type.JOIN ){
                if (findUserByName(message.getSenderName()) == null && !message.getSenderName().equals("host")){
                    users.add(new User(users.size() + 1, message.getSenderName(), 0, false));
                    System.out.println(users.size());
                }
                message.setMessage(new ObjectMapper().writeValueAsString(users));
            }
            if (message.getType() == Type.ANSWER){
                if (isAllowAnswer){
                    User user = findUserByName(message.getSenderName());
                    user.setAnswering(true);
                    currentUser = user;
                    System.out.println(user.getName() + " is answering");
                    message.setMessage(new ObjectMapper().writeValueAsString(users));
                    simpMessagingTemplate.convertAndSend("/test/public", message);
                    time = 3;
                    timer.cancel();
                    timer = new Timer();
                    countdown(message);
                    isAllowAnswer = false;
                } else {
                    return null;
                }
            }
            if (message.getType() == Type.QUESTION){
                currentUser = null;
                isAllowAnswer = true;
            }
            if (message.getType() == Type.TRUE){
                if (currentUser != null){
                    time = 3;
                    timer.cancel();
                    currentUser.setScore(currentUser.getScore() + 10);
                    currentUser.setAnswering(false);
                    message.setMessage(new ObjectMapper().writeValueAsString(users));

                } else {
                    return null;
                }
            }
            if (message.getType() == Type.FALSE){
                if (currentUser != null){
                    time = 3;
                    timer.cancel();
                    currentUser.setScore(currentUser.getScore() - 5);
                    currentUser.setAnswering(false);
                    message.setMessage(new ObjectMapper().writeValueAsString(users));

                } else {
                    return null;
                }
            }
            if (message.getType() == Type.COUNT){
                if (isAllowAnswer){
                    time = 3;
                    timer = new Timer();
                    countdown(message);
                }
            }
            if (message.getType() == Type.DELETE){
                deleteUser(message.getMessage());
                message.setMessage(new ObjectMapper().writeValueAsString(users));
            }
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return message;
    }

    private void countdown(Message message){
        System.out.println("Start count down");
        System.out.println("Time: " + time);
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                System.out.println(time);
                if (time <= 0){
                    timer.cancel();
                    isAllowAnswer = false;
                    System.out.println("End count");
                }
                message.setMessage(String.valueOf(time));
                message.setType(Type.TIME);
                simpMessagingTemplate.convertAndSend("/test/public", message);
                time--;
            }
        }, 1000, 1000);
    }

    private User findUserByName(String name){
        for (User user :
                users) {
            if (user.getName().equals(name)){
                return user;
            }
        }
        return null;
    }

    private void deleteUser(String name){
        User user = findUserByName(name);
        if (user != null){
            users.remove(user);
        }
    }

}
