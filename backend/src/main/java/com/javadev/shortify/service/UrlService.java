package com.javadev.shortify.service;

import com.javadev.shortify.dto.ShortenRequest;
import com.javadev.shortify.dto.ShortenResponse;
import com.javadev.shortify.model.Url;
import com.javadev.shortify.model.User;
import com.javadev.shortify.repository.UrlRepository;
import com.javadev.shortify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UrlService.class);

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.base-url}")
    private String BASE_URL;

    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public ShortenResponse shortenUrl(ShortenRequest request, String userEmail) {

        if (!isValidUrl(request.getUrl())) {
            throw new RuntimeException("Invalid URL. Must start with http:// or https://");
        }

        String shortCode;

        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            shortCode = request.getCustomAlias();
            if (urlRepository.existsByShortCode(shortCode)) {
                throw new RuntimeException("Custom alias already taken.");
            }
        } else {
            shortCode = generateCode();
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Url url = new Url();
        url.setShortCode(shortCode);
        url.setLongUrl(request.getUrl());
        url.setUser(user);

        if (request.getExpiryDays() != null) {
            url.setExpiryDate(LocalDateTime.now().plusDays(request.getExpiryDays()));
        }

        urlRepository.save(url);

        ShortenResponse response = new ShortenResponse();
        response.setShortUrl(BASE_URL + shortCode);
        response.setShortCode(shortCode);
        response.setLongUrl(request.getUrl());
        response.setClicks(0L);

        log.info("Short URL created: {} -> {}", shortCode, request.getUrl());

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

        log.info("Redirect: /{} -> {} | Total clicks: {}", shortCode, url.getLongUrl(), url.getClicks());

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
        response.setCreatedAt(url.getCreatedAt());
        response.setExpiryDate(url.getExpiryDate());

        return response;
    }

    public List<ShortenResponse> getDashboard(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found."));

        return urlRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(url -> {
                    ShortenResponse r = new ShortenResponse();
                    r.setShortUrl(BASE_URL + url.getShortCode());
                    r.setShortCode(url.getShortCode());
                    r.setLongUrl(url.getLongUrl());
                    r.setClicks(url.getClicks());
                    r.setCreatedAt(url.getCreatedAt());
                    r.setExpiryDate(url.getExpiryDate());
                    return r;
                })
                .collect(Collectors.toList());
    }

    public void deleteUrl(String shortCode, String userEmail) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short link not found."));

        if (!url.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to delete this link.");
        }

        urlRepository.delete(url);
        log.info("Deleted short URL: {}", shortCode);
    }

    private boolean isValidUrl(String url) {
        try {
            new java.net.URL(url).toURI();
            return url.startsWith("http://") || url.startsWith("https://");
        } catch (Exception e) {
            return false;
        }
    }

    private String generateCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        if (urlRepository.existsByShortCode(code.toString())) {
            return generateCode();
        }
        return code.toString();
    }
}