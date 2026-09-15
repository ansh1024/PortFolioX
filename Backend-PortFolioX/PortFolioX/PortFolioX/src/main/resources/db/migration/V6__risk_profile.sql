create table risk_profile(
    risk_profile_id varchar(255) primary key ,
    user_id bigint not null , foreign key(user_id) references users(user_id),
    risk_score decimal(5,2),
    risk_category enum("LOW","MODERATE","HIGH","VERY HIGH"),
    calculated_at timestamp
)