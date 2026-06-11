package com.javadev.shortify.dto;

import lombok.Data;

@Data
public class ShortenRequest {
    private String url;
    private String customAlias;   // optional
    private Integer expiryDays;   // optional
}