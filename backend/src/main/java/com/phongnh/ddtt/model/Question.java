package com.phongnh.ddtt.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Question {
    private String question;
    private String answer;
    private int score;
    private String image;
    private String audio;
    private String video;
    private QuestionType type;
}

