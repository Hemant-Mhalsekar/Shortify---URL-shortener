package com.javadev.shortify.controller;

import com.javadev.shortify.dto.ShortenRequest;
import com.javadev.shortify.dto.ShortenResponse;
import com.javadev.shortify.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/api/shorten")
    public ResponseEntity<ShortenResponse> shorten(@RequestBody ShortenRequest request,
                                                   Principal principal) {
        ShortenResponse response = urlService.shortenUrl(request, principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        String longUrl = urlService.getOriginalUrl(shortCode);
        return ResponseEntity.status(302).location(URI.create(longUrl)).build();
    }

    @GetMapping("/api/stats/{shortCode}")
    public ResponseEntity<ShortenResponse> getStats(@PathVariable String shortCode) {
        return ResponseEntity.ok(urlService.getStats(shortCode));
    }

    @GetMapping("/api/dashboard")
    public ResponseEntity<List<ShortenResponse>> dashboard(Principal principal) {
        return ResponseEntity.ok(urlService.getDashboard(principal.getName()));
    }

    @DeleteMapping("/api/link/{shortCode}")
    public ResponseEntity<Void> deleteLink(@PathVariable String shortCode,
                                           Principal principal) {
        urlService.deleteUrl(shortCode, principal.getName());
        return ResponseEntity.noContent().build();
    }
}