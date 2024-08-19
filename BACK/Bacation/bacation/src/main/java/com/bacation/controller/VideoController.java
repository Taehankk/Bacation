package com.bacation.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/video/sessions")
@Slf4j
public class VideoController {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
        log.info("OpenVidu initialized with URL: {} and SECRET: {}", OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping
    public ResponseEntity<?> initializeSession(@RequestBody(required = false) Map<String, Object> params) {
        log.info("Received request to initialize session with params: {}", params);

        // 기본 SessionProperties 객체를 생성합니다.
        SessionProperties.Builder builder = new SessionProperties.Builder();

        // params가 null이거나 빈 경우 기본값을 사용합니다.
        if (params != null && !params.isEmpty()) {
            // 예: customSessionId가 params에 포함되어 있는 경우
            if (params.containsKey("customSessionId")) {
                builder.customSessionId((String) params.get("customSessionId"));
            }

            // 추가적인 SessionProperties 설정이 필요한 경우, 여기에 추가합니다.
            // 예: builder.mediaMode((MediaMode) params.get("mediaMode"));
        }

        // SessionProperties 객체를 생성합니다.
        SessionProperties properties = builder.build();

        try {
            // 세션을 생성합니다.
            Session session = openvidu.createSession(properties);
            log.info("Session created with ID: {}", session.getSessionId());
            return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("Failed to create session: {}", e.getMessage(), e);
            return new ResponseEntity<>("Failed to create session", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage(), e);
            return new ResponseEntity<>("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params) {
        log.info("Received request to create connection in session {} with params: {}", sessionId, params);
        try {
            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                log.warn("Session with ID {} not found", sessionId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
            Connection connection = session.createConnection(properties);
            log.info("Connection created with token: {}", connection.getToken());
            return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            log.error("Failed to create connection: {}", e.getMessage(), e);
            return new ResponseEntity<>("Failed to create connection", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage(), e);
            return new ResponseEntity<>("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
