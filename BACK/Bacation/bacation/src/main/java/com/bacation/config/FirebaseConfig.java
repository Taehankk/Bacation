package com.bacation.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.type}")
    private String type;

    @Value("${firebase.project_id}")
    private String projectId;

    @Value("${firebase.private_key_id}")
    private String privateKeyId;

    @Value("${firebase.private_key}")
    private String privateKey;

    @Value("${firebase.client_email}")
    private String clientEmail;

    @Value("${firebase.client_id}")
    private String clientId;

    @Value("${firebase.auth_uri}")
    private String authUri;

    @Value("${firebase.token_uri}")
    private String tokenUri;

    @Value("${firebase.auth_provider_x509_cert_url}")
    private String authProviderCertUrl;

    @Value("${firebase.client_x509_cert_url}")
    private String clientCertUrl;

    @Value("${firebase.universe_domain}")
    private String universeDomain;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) { // 앱정보가 없다면
            // JSON 문자열을 생성
            String firebaseJson = String.format(
                    "{\n" +
                            "  \"type\": \"%s\",\n" +
                            "  \"project_id\": \"%s\",\n" +
                            "  \"private_key_id\": \"%s\",\n" +
                            "  \"private_key\": \"%s\",\n" +
                            "  \"client_email\": \"%s\",\n" +
                            "  \"client_id\": \"%s\",\n" +
                            "  \"auth_uri\": \"%s\",\n" +
                            "  \"token_uri\": \"%s\",\n" +
                            "  \"auth_provider_x509_cert_url\": \"%s\",\n" +
                            "  \"client_x509_cert_url\": \"%s\",\n" +
                            "  \"universe_domain\": \"%s\"\n" +
                            "}",
                    type, projectId, privateKeyId, privateKey, clientEmail, clientId, authUri, tokenUri, authProviderCertUrl, clientCertUrl, universeDomain
            );

            // JSON 문자열을 InputStream으로 변환
            InputStream fireBaseInputStream = new ByteArrayInputStream(firebaseJson.getBytes(StandardCharsets.UTF_8));

            // 인가 키로 인증을 받음
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(fireBaseInputStream))
                    .build();
            // 인증받은 객체를 반환
            return FirebaseApp.initializeApp(options);
        }
        // 앱정보가 있어서 바로 반환
        return FirebaseApp.getInstance();
    }

    @Bean
    FirebaseMessaging firebaseMessaging() throws IOException { // 메세지를 보내기 위한 정보들
        return FirebaseMessaging.getInstance(firebaseApp());
    }
}
