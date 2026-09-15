create table score_log(
    score_log_id varchar(255) primary key ,
    ipo_id bigint not null, foreign key(ipo_id) references ipo_masters(ipo_id),
    gmp_score integer ,
    subscription_score integer,
    fundamental_score integer,
    sector_score integer,
    historical_score integer,
    total_score integer,
    verdict enum("APPLY","WATCH","SKIP"),
    calculated_at timestamp
);