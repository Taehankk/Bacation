package com.bacation.model.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageUploadService {

    private final AmazonS3Client s3Client;
    private MemberService memberService;

    @Autowired
    public ImageUploadService(AmazonS3Client s3Client, MemberService memberService) {
        this.s3Client = s3Client;
        this.memberService = memberService;
    }

    @Value("${s3.bucket}")
    private String bucket;

    public String upload(String base64Image) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // 파일 이름 생성
        String fileName = bucket+memberService.getCurrentMemberId()+LocalDateTime.now()+".png";

        // S3에 업로드할 파일의 메타데이터 생성
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/png");
        metadata.setContentLength(imageBytes.length);

        // 디코딩된 이미지를 ByteArrayInputStream으로 변환
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageBytes);

        // S3에 파일 업로드
        s3Client.putObject(bucket, fileName, byteArrayInputStream, metadata);

        // 업로드한 파일의 S3 URL 주소 반환
        return s3Client.getUrl(bucket, fileName).toString();
    }

}