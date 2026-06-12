package com.javadev.shortify.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "urls")
@Data
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shortCode;

    @Column(nullable = false, length = 2048)
    private String longUrl;

    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
    private Long clicks = 0L;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}