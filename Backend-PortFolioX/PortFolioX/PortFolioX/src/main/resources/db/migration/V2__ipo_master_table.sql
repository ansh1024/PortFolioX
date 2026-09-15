create table ipo_masters(
    ipo_id bigint not null auto_increment primary key,
    company_name varchar(255) not null,
    opening_date date,
    closing_date date,
    allotment_date date,
    price float ,
    gmp integer,
    sector varchar(255),
    subscription_qib float,
    subscription_shni float,
    subscription_bhni float,
    subscription_retail float,
    subscription_employee float,
    ipo_status enum("OPEN","CLOSED","UPCOMING","ALLOTMENT","LISTED")
);
alter table ipo_masters auto_increment=1;