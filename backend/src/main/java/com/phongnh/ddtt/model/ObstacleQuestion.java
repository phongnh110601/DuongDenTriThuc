package com.phongnh.ddtt.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@JsonSerialize
@NoArgsConstructor
@AllArgsConstructor
public class ObstacleQuestion extends Question {
    private boolean isAnswered;
    private boolean isCorrect;
    private boolean isSelecting;

    public ObstacleQuestion(String question, String answer, int score, String image, String audio, String video, QuestionType type, boolean isAnswered, boolean isCorrect, boolean isSelecting) {
        super(question, answer, score, image, audio, video, type);
        this.isAnswered = isAnswered;
        this.isCorrect = isCorrect;
        this.isSelecting = isSelecting;
    }
}
