package com.phongnh.ddtt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@JsonSerialize
@NoArgsConstructor
@ToString
public class User {
    private String name;
    private int score;
    private boolean isAnswering;
    private String answer;
    private double answerTime;
    private String sessionId;
    private boolean isSelected;
    private int answerIndex;
    private boolean isCorrect;
    private String avatar;
}
