create table ipo_application(
    application_id varchar(255) not null primary key,
    user_id bigint not null, foreign key(user_id) references users(user_id) ,
    ipo_id bigint not null, foreign key(ipo_id) references ipo_masters(ipo_id) ,
    lots_applied integer not null,
    lots_allotted integer default(NULL),
    application_status enum("SUBMITTED","CANCELLED"),
    allotment_status enum("ALLOTTED","NOT ALLOTTED","PENDING")
);