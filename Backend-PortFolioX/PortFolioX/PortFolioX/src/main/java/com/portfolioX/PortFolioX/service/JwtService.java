package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Date;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;


@Service
public class JwtService {

    private final long expirationMs;
    private final String secretKey;

    public JwtService(@Value("${jwt.expiration-ms}") long expirationMs,
                      @Value("${jwt.secret}") String secretKey){
        this.expirationMs=expirationMs;
        this.secretKey=secretKey;
    }
    public String generateToken(User user){
        return Jwts.builder()
                .subject(String.valueOf(user.getUserId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+expirationMs))
                .signWith(getSigningKey())
                .compact();
    }
    public SecretKey getSigningKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public long validateToken(String token){
        String subject = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

        return Long.parseLong(subject);
    }

}
