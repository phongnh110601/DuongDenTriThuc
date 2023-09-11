package com.phongnh.ddtt.model;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    private String message;
    private MessageType type;
}
