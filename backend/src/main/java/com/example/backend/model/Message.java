package com.example.backend.model;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {

    private String senderName;
    private String message;
    private String receivedTime;

    private Type type;
}
