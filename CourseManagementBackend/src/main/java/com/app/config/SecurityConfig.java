package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.app.service.StaffUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity()
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	private final StaffUserDetailsService userDetailsService;

	private final JwtAuthenticationFilter jwtAuthFilter;

	// Security Filter Chain

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> {
		}) // Enable CORS for frontend

				.authorizeHttpRequests(auth -> auth

						// ----- Premises -----
						.requestMatchers(HttpMethod.GET, "/premises/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/premises/**").hasRole("ADMIN")

						// ----- Infrastructure -----
						.requestMatchers(HttpMethod.GET, "/infrastructure/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/infrastructure/**").hasRole("ADMIN")

						// ----- Course Type -----
						.requestMatchers(HttpMethod.GET, "/coursetype/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/coursetype/**").hasRole("ADMIN")

						// ----- Batch Cycle -----
						.requestMatchers(HttpMethod.GET, "/batchcycle/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/batchcycle/**").hasRole("ADMIN")

						// ----- Course -----
						.requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/api/courses/**").hasRole("ADMIN")

						// ----- Subject -----
						.requestMatchers(HttpMethod.GET, "/api/subjects/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/api/subjects/**").hasRole("ADMIN")

						// ----- Menu Items -----
						.requestMatchers(HttpMethod.GET, "/menuitems/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/menuitems/**").hasRole("ADMIN")

						// ----- Roles -----
						.requestMatchers("/roles/**").hasRole("ADMIN")

						// ----- Staff -----
						.requestMatchers(HttpMethod.GET, "/staff/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers(HttpMethod.PUT,"/staff/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/staff/**").hasRole("ADMIN")

						// ----- Schedules -----
						.requestMatchers(HttpMethod.GET, "/api/schedules/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/api/schedules/**").hasRole("COORDINATOR")

						// ----- Course Group (only coordinator can manage) -----
						.requestMatchers(HttpMethod.GET, "/coursegroup/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/coursegroup/**").hasRole("COORDINATOR")

						// ----- Sessions (only coordinator can manage) -----
						.requestMatchers(HttpMethod.GET, "/session/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/session/**").hasRole("COORDINATOR")

						// ----- Students (only coordinator can manage) -----
						.requestMatchers(HttpMethod.GET, "/students/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/students/**").hasRole("COORDINATOR")

						// ------- Recorded Video (Only coordinator can manage )-----------

						.requestMatchers(HttpMethod.GET, "/api/recorded-videos/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/api/recorded-videos/**").hasRole("COORDINATOR")

						// ----- Course Modules (only coordinator can manage) -----
						.requestMatchers(HttpMethod.GET, "/api/course-modules/**").hasAnyRole("ADMIN", "COORDINATOR")
						.requestMatchers("/api/course-modules/**").hasRole("COORDINATOR")

						// ----- Authentication -----
						.requestMatchers("/login/**").permitAll()

						// Any other request requires authentication
						.anyRequest().authenticated())

				.userDetailsService(userDetailsService)
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.formLogin(form -> form.disable()).httpBasic(basic -> basic.disable());

		return http.build();
	}

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .csrf(csrf -> csrf.disable())   // disable CSRF
//            .cors(Customizer.withDefaults())  // disable CORS security (optional, frontend can call directly)
//            .authorizeHttpRequests(auth -> auth
//                .anyRequest().permitAll()   // 🔓 allow all requests
//            )
//            .formLogin(form -> form.disable()) // disable login form
//            .httpBasic(basic -> basic.disable()); // disable basic auth
//        	
//        return http.build();
//    }

//   @Bean
//	public CorsConfigurationSource corsConfigurationSource() {
//		CorsConfiguration configuration = new CorsConfiguration();
//		configuration.setAllowedOrigins(List.of("http://localhost:5174")); // frontend URL
//		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//		configuration.setAllowedHeaders(List.of("*"));
//		configuration.setAllowCredentials(true);
//
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", configuration);
//		return source;
//	}

	// Authentication Manager (used in AuthService for login)

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	// Password encoder (BCrypt)

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
