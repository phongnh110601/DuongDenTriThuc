package com.phongnh.ddtt.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
@JsonSerialize
public class Obstacle {
    private List<ObstacleQuestion> questions;
    private String answer;
    private String image;
    private boolean isCorrect;
}
