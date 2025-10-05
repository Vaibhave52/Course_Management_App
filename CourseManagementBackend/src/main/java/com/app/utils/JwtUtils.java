package com.app.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtUtils {

	private static final String SECRET_KEY = "MySuperSecretKeyForJwtAuth1234567890"; // >=32 chars

	private static final long EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

	private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

	public String generateToken(String email, String role, String name) {

		Map<String, Object> claims = new HashMap<>();
		claims.put("role", role);
		claims.put("name", name);

		log.info("Generated token exp: {}", new Date(System.currentTimeMillis() + EXPIRATION_MS));

		return Jwts.builder().setClaims(claims).setSubject(email).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
				.signWith(key, SignatureAlgorithm.HS256).compact();

	}

	public String extractUsername(String token) {

		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();

	}

	public String extractClaim(String token, String claimKey) {

		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get(claimKey,
				String.class);

	}

	public boolean validateToken(String token, String email) {

		return extractUsername(token).equals(email) && !isTokenExpired(token);

	}

	private boolean isTokenExpired(String token) {

		Date expiration = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody()
				.getExpiration();

		log.error("Token expiration: {}", expiration);

		return expiration.before(new Date());
	}
}
