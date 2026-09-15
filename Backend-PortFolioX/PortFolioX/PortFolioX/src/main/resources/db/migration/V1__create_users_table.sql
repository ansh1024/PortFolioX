create table users (
    user_id bigint AUTO_INCREMENT primary key,
    email varchar(255) not null unique ,
    name varchar(255) not null,
    password varchar(255) not null,
    role enum('ADMIN','USER') not null,
    creation_time timestamp default current_timestamp() not null,
    last_login timestamp
 );
alter table users AUTO_INCREMENT=101;