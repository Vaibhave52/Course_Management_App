//package com.app.config;
//
//import java.io.IOException;
//
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import com.app.service.StaffUserDetailsService;
//import com.app.utils.JwtUtils;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//	private final JwtUtils jwtUtils;
//
//	private final StaffUserDetailsService userDetailsService;
//
//	@Override
//	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//			throws ServletException, IOException {
//
//		final String authHeader = request.getHeader("Authorization");
//		 String token=null;
//		 String email=null;
//
//		//  Check if header is present and starts with Bearer
//		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//
//			filterChain.doFilter(request, response);        // no token continue chain 
//
//			return;
//		}
//
//		//  Extract JWT token  and (skip Bearer) 
//		token = authHeader.substring(7);
//		
//		log.info("Token received: {}", token);
//
//		
//		//Extract email (subject) from token
//		
//		email = jwtUtils.extractUsername(token);
//
//		// 3 If email exists and user is not authenticated yet
//		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//
//			var userDetails = userDetailsService.loadUserByUsername(email);
//
//			//  Validate token against email
//			if (jwtUtils.validateToken(token, userDetails.getUsername())) {
//
//				  //  Build Authentication token
//				
//				var authToken = new UsernamePasswordAuthenticationToken(
//						userDetails, null,
//						userDetails.getAuthorities());
//				
//				log.info("Authorities set in context: {}", authToken.getAuthorities());
//
//				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//
//				// 5️ Set authentication in context
//				SecurityContextHolder.getContext().setAuthentication(authToken);
//				
//				log.info("Authorities set in context: {}", authToken.getAuthorities());
//				
//				
//
//			}
//		}
//
//		// 6️⃣ Continue filter chain
//		filterChain.doFilter(request, response);
//	}
//
//}

package com.app.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.app.service.StaffUserDetailsService;
import com.app.utils.JwtUtils;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;
	private final StaffUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		final String authHeader = request.getHeader("Authorization");
		String token = null;
		String email = null;

		try {
			// 1️ Check header
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				filterChain.doFilter(request, response);
				return;
			}

			// 2️ Extract token
			token = authHeader.substring(7);
			log.info("Token received: {}", token);

			// 3️ Extract email (can throw ExpiredJwtException)
			email = jwtUtils.extractUsername(token);

			// 4️ If email exists and not authenticated yet
			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				var userDetails = userDetailsService.loadUserByUsername(email);

				if (jwtUtils.validateToken(token, userDetails.getUsername())) {
					var authToken = new UsernamePasswordAuthenticationToken(userDetails, null,
							userDetails.getAuthorities());

					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
					log.info("Authorities set in context: {}", authToken.getAuthorities());
					log.info("userDetails Authories {} ", userDetails.getAuthorities());
				}
			}

			// Continue filter chain
			filterChain.doFilter(request, response);

		} catch (ExpiredJwtException ex) {
			log.warn("JWT expired: {}", ex.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
			response.getWriter().write("JWT_EXPIRED");
		} catch (Exception ex) {
			log.error("JWT processing failed: {}", ex.getMessage());
			response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
			response.getWriter().write("UNAUTHORIZED_ACCESS");
		}
	}
}
