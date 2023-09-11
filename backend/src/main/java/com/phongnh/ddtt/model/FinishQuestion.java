package com.phongnh.ddtt.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonSerialize
@ToString
public class FinishQuestion {
    private List<Question> mediumQuestions;
    private List<Question> hardQuestions;

}
