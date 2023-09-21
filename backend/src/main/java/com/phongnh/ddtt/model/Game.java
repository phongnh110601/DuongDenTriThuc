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
    private List<Question> extraQuestions = new ArrayList<>();
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
    private static long accelerationStartTime;
    @Autowired
    @JsonIgnore
    private SimpMessagingTemplate simpMessagingTemplate;
    @JsonIgnore
    private static ObjectMapper objectMapper = new ObjectMapper();
    @JsonIgnore
    private static User currentUser;
    public Message processMessage(Message message){
        try {
            if (message.getType() == MessageType.JOIN) {
                message.setMessage(objectMapper.writeValueAsString(users));
                Message roundMessage = new Message(String.valueOf(currentRound), MessageType.ROUND);
                simpMessagingTemplate.convertAndSend("/test/public", roundMessage);
                if (currentRound == 2){
                    Message obstacleMessage = new Message(objectMapper.writeValueAsString(obstacle), MessageType.OBSTACLE);
                    simpMessagingTemplate.convertAndSend("/test/public", obstacleMessage);
                }
            } else if (message.getType() == MessageType.USER){
                obstacleAnswerIndex = 1;
                users = objectMapper.readValue(message.getMessage(), new TypeReference<List<User>>(){});
            } else if (message.getType() == MessageType.START || message.getType() == MessageType.ROUND) {
                currentRound = Integer.parseInt(message.getMessage());
            } else if (message.getType() == MessageType.FINISH) {
                currentRound = 0;
            } else if (currentRound == 1){
                return startRound(message);
            } else if (currentRound == 2){
                return obstacleRound(message);
            } else if (currentRound == 3){
                return accelerationRound(message);
            } else if (currentRound == 4){
                return finishRound(message);
            } else if (currentRound == 5){
                return extraRound(message);
            }

        } catch (Exception e) {
            System.out.println(e);
        }
        return message;
    }

    private Message startRound(Message message) throws JsonProcessingException {
        System.out.println("Start round");
        if (message.getType() == MessageType.ANSWER) {
            if (isAllowAnswer) {
                isAllowAnswer = false;
                currentUser = findUserBySessionId(message.getMessage());
                currentUser.setAnswering(true);
                message.setMessage(objectMapper.writeValueAsString(users));
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
        } else if (message.getType() == MessageType.TRUE){
            currentUser.setScore(currentUser.getScore() + 10);
            currentUser.setAnswering(false);
            message.setMessage(objectMapper.writeValueAsString(users));
        } else if (message.getType() == MessageType.FALSE){
            if (currentUser.getScore() >= 5){
                currentUser.setScore(currentUser.getScore() - 5);
            }
            currentUser.setAnswering(false);
            message.setMessage(objectMapper.writeValueAsString(users));
        }
        System.out.println(message);
        return message;
    }

    private Message obstacleRound(Message message) throws JsonProcessingException {
        if (message.getType() == MessageType.ANSWER){
            User sender = objectMapper.readValue(message.getMessage(), new TypeReference<User>(){});
            User user = findUserBySessionId(sender.getSessionId());
            if (!user.isAnswering() && isAllowAnswer){
                user.setAnswer(sender.getAnswer());
                message.setMessage(objectMapper.writeValueAsString(users));
            } else {
                return null;
            }
        } else if (message.getType() == MessageType.ANSWER_OBSTACLE){
            User user = findUserBySessionId(message.getMessage());
            if (!user.isAnswering()){
                user.setAnswering(true);
                user.setAnswer("");
                user.setAnswerIndex(obstacleAnswerIndex++);
                message.setMessage(objectMapper.writeValueAsString(users));
            } else {
                return null;
            }
        } else if (message.getType() == MessageType.COUNT) {
            isAllowAnswer = true;
            time = 15;
            timer.cancel();
            timer = new Timer();
            countdown(message);
        } else if (message.getType() == MessageType.OBSTACLE || message.getType() == MessageType.QUESTION){
            obstacle = objectMapper.readValue(message.getMessage(), new TypeReference<Obstacle>(){});
        } else if (message.getType() == MessageType.TRUE || message.getType() == MessageType.FALSE){
            users = objectMapper.readValue(message.getMessage(), new TypeReference<List<User>>(){});
        }
        return message;
    }

    private Message accelerationRound(Message message) throws JsonProcessingException {
        if (message.getType() == MessageType.ANSWER){
            if (isAllowAnswer) {
                long answerTime = System.nanoTime();
                User sender = objectMapper.readValue(message.getMessage(), new TypeReference<User>(){});
                User user = findUserBySessionId(sender.getSessionId());
                user.setAnswer(sender.getAnswer());
                user.setAnswerTime((double) (answerTime - accelerationStartTime - 1000000000) / 1000000000);
                message.setMessage(objectMapper.writeValueAsString(users));
            } else {
                return null;
            }
        }
        if (message.getType() == MessageType.COUNT) {
            accelerationStartTime = System.nanoTime();
            isAllowAnswer = true;
            time = Integer.parseInt(message.getMessage());
            timer.cancel();
            timer = new Timer();
            countdown(message);
        }
        if (message.getType() == MessageType.TRUE || message.getType() == MessageType.FALSE){
            users = objectMapper.readValue(message.getMessage(), new TypeReference<List<User>>(){});
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
                message.setMessage(objectMapper.writeValueAsString(users));
            } else {
                return null;
            }
        }
        if (message.getType() == MessageType.SELECT_USER || message.getType() == MessageType.DESELECT_USER){
            users = objectMapper.readValue(message.getMessage(), new TypeReference<List<User>>(){});
        }
        if (message.getType() == MessageType.TRUE || message.getType() == MessageType.FALSE){
            users = objectMapper.readValue(message.getMessage(), new TypeReference<List<User>>(){});
        }
        return message;
    }

    private Message extraRound(Message message) throws JsonProcessingException {
        if (message.getType() == MessageType.ANSWER) {
            if (isAllowAnswer) {
                isAllowAnswer = false;
                currentUser = findUserBySessionId(message.getMessage());
                currentUser.setAnswering(true);
                message.setMessage(objectMapper.writeValueAsString(users));
            } else {
                return null;
            }
        } else if (message.getType() == MessageType.QUESTION) {
            isAllowAnswer = true;
        } else if (message.getType() == MessageType.COUNT) {
            if (isAllowAnswer) {
                time = 15;
                timer.cancel();
                timer = new Timer();
                countdown(message);
            }
        } else if (message.getType() == MessageType.TRUE || message.getType() == MessageType.FALSE){
            currentUser.setAnswering(false);
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
        users.add(new User(name, 0, false, "", 0, sessionId, false, 1, false, "player/player" + (users.size() + 1) + ".png"));
    }

    public void updateUsersToClient() {
        Message message = new Message();
        try {
            message.setMessage(objectMapper.writeValueAsString(users));
            message.setType(MessageType.USER);
            simpMessagingTemplate.convertAndSend("/test/public", message);
        } catch (JsonProcessingException e) {
            System.out.println(e);
        }
    }
}
