package com.javadev.shortify.dto;

import lombok.Data;

@Data
public class ShortenResponse {
    private String shortUrl;
    private String shortCode;
    private String longUrl;
    private Long clicks;
}