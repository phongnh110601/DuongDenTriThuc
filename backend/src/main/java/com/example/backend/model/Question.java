package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class Question {
    private String question;
    private String answer;
    private int score;
    private String image;
    private String audio;
    private String video;
    private int packageIndex;
    private int index;
    private QuestionType type;
}
