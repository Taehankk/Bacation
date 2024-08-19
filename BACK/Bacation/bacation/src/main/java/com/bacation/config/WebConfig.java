package com.bacation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "https://i11b307.p.ssafy.io",
                        "http://localhost:5173",
                        "https://bacation.s3.ap-northeast-2.amazonaws.com",
                        "https://i11b307.p.ssafy.io:8443"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    // @Override
    // public void addInterceptors(InterceptorRegistry registry) {
    //     registry.addInterceptor(new SessionInterceptor())
    //             .addPathPatterns("/**")
    //             .excludePathPatterns("/public/**");
    // }
}
