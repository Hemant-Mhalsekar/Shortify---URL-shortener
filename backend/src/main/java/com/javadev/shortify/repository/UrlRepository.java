package com.javadev.shortify.repository;

import com.javadev.shortify.model.Url;
import com.javadev.shortify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    List<Url> findByUserOrderByCreatedAtDesc(User user);
}