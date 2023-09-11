package com.phongnh.ddtt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

@Getter
@Setter
@Component
public class Game {

    @JsonIgnore
    private static List<User> users = new ArrayList<>();
    private List<StartQuestion> startQuestions = new ArrayList<>();
    private Obstacle obstacle = new Obstacle();
    private List<Question> accelerationQuestions = new ArrayList<>();
    private FinishQuestion finishQuestions = new FinishQuestion();
    @JsonIgnore
    private static int currentRound = 0;
    @JsonIgnore
    private static boolean isAllowAnswer = false;
    @JsonIgnore
    private static Timer timer = new Timer();
    @JsonIgnore
    private static int time = 0;
    @JsonIgnore
    private static int obstacleAnswerIndex = 1;
    @JsonIgnore
    private static long startProcessingTime;
    @JsonIgnore
    private static long endProcessingTime;
    @JsonIgnore
    private static long accelerationStartTime;
    @Autowired
    @JsonIgnore
    private SimpMessagingTemplate simpMessagingTemplate;
    public Message processMessage(Message message){
        startProcessingTime = System.nanoTime();
        try {
            if (message.getType() == MessageType.JOIN) {
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                Message roundMessage = new Message(String.valueOf(currentRound), MessageType.ROUND);
                simpMessagingTemplate.convertAndSend("/test/public", roundMessage);
                if (currentRound == 2){
                    Message obstacleMessage = new Message(new ObjectMapper().writeValueAsString(obstacle), MessageType.OBSTACLE);
                    simpMessagingTemplate.convertAndSend("/test/public", obstacleMessage);
                }
            } else if (message.getType() == MessageType.UPDATE){
                obstacleAnswerIndex = 1;
                users = new ObjectMapper().readValue(message.getMessage(), new TypeReference<List<User>>(){});
            } else if (message.getType() == MessageType.ROUND){
                currentRound = Integer.parseInt(message.getMessage());
            } else if (currentRound == 1){
                return startRound(message);
            } else if (currentRound == 2){
                return obstacleRound(message);
            } else if (currentRound == 3){
                return accelerationRound(message);
            } else if (currentRound == 4){
                return finishRound(message);
            }

        } catch (Exception e) {
            System.out.println(e);
        }
        endProcessingTime = System.nanoTime();
        System.out.println("Time processing: " + (endProcessingTime - startProcessingTime) / 1000000);
        return message;
    }

    private Message startRound(Message message) throws JsonProcessingException {
        System.out.println("Start round");
        if (message.getType() == MessageType.ANSWER) {
            if (isAllowAnswer) {
                isAllowAnswer = false;
                User user = findUserBySessionId(message.getMessage());
                user.setAnswering(true);
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                time = 3;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            } else {
                return null;
            }
        } else if (message.getType() == MessageType.QUESTION) {
            isAllowAnswer = true;
        } else if (message.getType() == MessageType.COUNT) {
            if (isAllowAnswer) {
                time = 3;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            }
        }
        endProcessingTime = System.nanoTime();
        System.out.println("Time processing: " + (endProcessingTime - startProcessingTime) / 1000000);
        return message;
    }

    private Message obstacleRound(Message message) throws JsonProcessingException {
        System.out.println("Obstacle round");
        if (message.getType() == MessageType.ANSWER){
            User sender = new ObjectMapper().readValue(message.getMessage(), new TypeReference<User>(){});
            if (sender.getAnswer().equals("obstacle") && !sender.isAnswering()){
                User user = findUserBySessionId(sender.getSessionId());
                user.setAnswer("");
                user.setAnswerIndex(obstacleAnswerIndex++);
                user.setAnswering(true);
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                return message;
            }
            if (isAllowAnswer && !sender.isAnswering()) {
                System.out.println("Allow answer");
                User user = findUserBySessionId(sender.getSessionId());
                user.setAnswer(sender.getAnswer());
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                System.out.println(message);
            } else {
                return null;
            }
        }
        if (message.getType() == MessageType.COUNT) {
            if (isAllowAnswer) {
                time = 15;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            }
        }
        if (message.getType() == MessageType.QUESTION) {
            isAllowAnswer = true;
        }
        if (message.getType() == MessageType.OBSTACLE){
            obstacle = new ObjectMapper().readValue(message.getMessage(), new TypeReference<Obstacle>(){});
        }
        endProcessingTime = System.nanoTime();
        System.out.println("Time processing: " + (endProcessingTime - startProcessingTime) / 1000000);
        return message;
    }

    private Message accelerationRound(Message message) throws JsonProcessingException {
        if (message.getType() == MessageType.ANSWER){
            if (isAllowAnswer) {
                long answerTime = System.nanoTime();
                User sender = new ObjectMapper().readValue(message.getMessage(), new TypeReference<User>(){});
                System.out.println("Allow answer");
                User user = findUserBySessionId(sender.getSessionId());
                user.setAnswer(sender.getAnswer());
                user.setAnswerTime((double) (answerTime - accelerationStartTime - 1000000000) / 1000000000);
                message.setMessage(new ObjectMapper().writeValueAsString(users));
                System.out.println(message);
            } else {
                return null;
            }
        }
        if (message.getType() == MessageType.COUNT) {
            isAllowAnswer = true;
            accelerationStartTime = System.nanoTime();
            if (isAllowAnswer) {
                time = Integer.parseInt(message.getMessage());
                timer.cancel();
                timer = new Timer();
                countdown(message);
            }
        }
        return message;
    }

    private Message finishRound(Message message) throws JsonProcessingException {
        if (message.getType() == MessageType.QUESTION){
            isAllowAnswer = false;
        }
        if (message.getType() == MessageType.COUNT){
            time = Integer.parseInt(message.getMessage());
            if (time == 5){
                isAllowAnswer = true;
            }
            timer.cancel();
            timer = new Timer();
            countdown(message);
        }
        if (message.getType() == MessageType.ANSWER){
            if (isAllowAnswer){
                isAllowAnswer = false;
                User user = findUserBySessionId(message.getMessage());
                user.setAnswering(true);
                message.setMessage(new ObjectMapper().writeValueAsString(users));
            } else {
                return null;
            }
        }

        return message;
    }
    private void countdown(Message message) {
        System.out.println("Start count down");
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                System.out.println(time);
                if (time <= 0) {
                    timer.cancel();
                    isAllowAnswer = false;
                    System.out.println("End count down");
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
        users.add(new User(name, 0, false, "", 0, sessionId, false, 1, false, "TS" + (users.size() + 1) + ".png"));
    }

    public void updateUsersToClient() {
        Message message = new Message();
        try {
            message.setMessage(new ObjectMapper().writeValueAsString(users));
            message.setType(MessageType.UPDATE);
            simpMessagingTemplate.convertAndSend("/test/public", message);
        } catch (JsonProcessingException e) {
            System.out.println(e);
        }
    }
}
