create table sip_holding(
    holding_id varchar(255) primary key,
    user_id bigint not null, foreign key(user_id) references users(user_id) ,
    fund_id varchar(255) not null, foreign key(fund_id) references mutual_funds(fund_id) ,
    units decimal(10,2),
    invested_amount decimal(15,2),
    current_value decimal(15,2),
    start_date date,
    sip_amount integer,
    frequency enum("MONTHLY","QUARTERLY","HALF-YEARLY","YEARLY","LUMPSUM"),
    XIRR decimal(5,2),
    unique(user_id,fund_id)
)