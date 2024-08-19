create database bacation DEFAULT CHARACTER SET utf8mb4;

USE bacation;

CREATE TABLE setting (
                         setting_id bigint not null,
                         fall_caution BOOLEAN,
                         crash_caution BOOLEAN,
                         stuck_caution BOOLEAN,
                         reverse_caution BOOLEAN,
                         sound_caution BOOLEAN,
                         PRIMARY KEY (setting_id)
);

create table detect (
                        detect_id bigint auto_increment,
                        member_id bigint not null,
                        detect_name Integer not null,
                        detect_time timestamp,
                        primary key (detect_id)
);


create table member(
                       member_id bigint auto_increment primary key not null,
                       auth_id bigint NOT NULL,
                       nickname varchar(20) NOT NULL,
                       email varchar(100),
                       profile_img_url varchar(600),
                       baby_name varchar(15),
                       baby_gender boolean,
                       baby_birthdate date,
                       unique (auth_id)
);

CREATE TABLE memberData (
                            memberData_id BIGINT AUTO_INCREMENT,
                            member_id BIGINT NOT NULL,
                            mode INT NOT NULL,
                            mode_start_time TIMESTAMP,
                            mode_end_time TIMESTAMP,
                            PRIMARY KEY (memberData_id)
);

create table capture (
                         capture_id bigint auto_increment,
                         record_id bigint,
                         member_id bigint not null,
                         capture_url varchar(100),
                         capture_time timestamp,
                         primary key (capture_id)
);

create table record (
                        record_id bigint auto_increment,
                        member_id bigint not null,
                        content varchar(300),
                        record_count bigint,
                        record_time timestamp,
                        primary key (record_id)
);

create table fcm (
                     fcm_id bigint,
                     token varchar(300),
                     primary key(fcm_id)
);





create index detect_index on detect(detect_id);
create index capture_index on capture(member_id);
create index memberData_index on memberData(member_id);



