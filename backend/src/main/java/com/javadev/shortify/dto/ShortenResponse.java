package com.javadev.shortify.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShortenResponse {
    private String shortUrl;
    private String shortCode;
    private String longUrl;
    private Long clicks;
    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
}