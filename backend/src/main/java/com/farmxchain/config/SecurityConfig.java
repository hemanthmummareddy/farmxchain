package com.farmxchain.config;

import com.farmxchain.security.JwtAuthFilter;
import com.farmxchain.security.JwtUtil;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/users/test").permitAll()

                        // Admin only
                        .requestMatchers("/api/admin/**", "/api/orders/admin/**", "/api/products/admin/**")
                        .hasRole("ADMIN")

                        // Everything else under /api needs a valid login
                        .requestMatchers("/api/**").authenticated()

                        // Home page and static files
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS CONFIGURATION
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}