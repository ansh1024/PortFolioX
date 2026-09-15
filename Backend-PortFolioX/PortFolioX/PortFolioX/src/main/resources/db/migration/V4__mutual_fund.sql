create table mutual_funds(
    fund_id varchar(255) primary key ,
    fund_name varchar(255) not null,
    AMC varchar(255) not null,
    category enum("EQUITY","DEBT","HYBRID","OTHERS"),
    NAV decimal(5,2),
    AUM bigint ,
    return_1day decimal(5,2),
    return_1month decimal(5,2),
    return_6month decimal(5,2),
    return_1year decimal(5,2),
    return_3year decimal(5,2),
    return_5year decimal(5,2)
);