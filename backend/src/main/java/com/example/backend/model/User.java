package com.example.backend.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@JsonSerialize
@NoArgsConstructor
public class User {
    private String name;
    private int score;
    private boolean isAnswering;
    private String sessionId;
}
