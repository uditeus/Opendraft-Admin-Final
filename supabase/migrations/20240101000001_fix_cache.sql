-- Force schema cache reload by DDL
create table if not exists _cache_buster (id serial primary key);
drop table _cache_buster;
