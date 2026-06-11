package com.javadev.shortify.service;

import com.javadev.shortify.dto.ShortenRequest;
import com.javadev.shortify.dto.ShortenResponse;
import com.javadev.shortify.model.Url;
import com.javadev.shortify.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    private static final String BASE_URL = "http://localhost:8080/";
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public ShortenResponse shortenUrl(ShortenRequest request) {
        String shortCode;

        // Use custom alias if provided, else generate one
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            shortCode = request.getCustomAlias();
            if (urlRepository.existsByShortCode(shortCode)) {
                throw new RuntimeException("Custom alias already taken.");
            }
        } else {
            shortCode = generateCode();
        }

        Url url = new Url();
        url.setShortCode(shortCode);
        url.setLongUrl(request.getUrl());

        if (request.getExpiryDays() != null) {
            url.setExpiryDate(LocalDateTime.now().plusDays(request.getExpiryDays()));
        }

        urlRepository.save(url);

        ShortenResponse response = new ShortenResponse();
        response.setShortUrl(BASE_URL + shortCode);
        response.setShortCode(shortCode);
        response.setLongUrl(request.getUrl());
        response.setClicks(0L);

        return response;
    }

    public String getOriginalUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short link not found."));

        if (url.getExpiryDate() != null && LocalDateTime.now().isAfter(url.getExpiryDate())) {
            throw new RuntimeException("This link has expired.");
        }

        url.setClicks(url.getClicks() + 1);
        urlRepository.save(url);

        return url.getLongUrl();
    }

    public ShortenResponse getStats(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short link not found."));

        ShortenResponse response = new ShortenResponse();
        response.setShortUrl(BASE_URL + shortCode);
        response.setShortCode(shortCode);
        response.setLongUrl(url.getLongUrl());
        response.setClicks(url.getClicks());

        return response;
    }

    private String generateCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        // Regenerate if collision
        if (urlRepository.existsByShortCode(code.toString())) {
            return generateCode();
        }
        return code.toString();
    }
}