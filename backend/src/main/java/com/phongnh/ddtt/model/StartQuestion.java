package com.phongnh.ddtt.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartQuestion extends Question {

    private int packageIndex;
    private int index;

    public StartQuestion(String question, String answer, int score, String image, String audio, String video, QuestionType type, int packageIndex, int index) {
        super(question, answer, score, image, audio, video, type);
        this.packageIndex = packageIndex;
        this.index = index;
    }
}
