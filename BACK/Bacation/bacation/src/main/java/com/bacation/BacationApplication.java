package com.bacation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

// Spring Security 사용 시 기본 로그인 화면 안뜨게 하기
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BacationApplication {

	public static void main(String[] args) {
		SpringApplication.run(BacationApplication.class, args);
	}

}
