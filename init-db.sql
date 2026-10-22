\set ON_ERROR_STOP on

create database project_dashboard;
\connect project_dashboard

begin;

create table projects (
    id integer generated always as identity primary key,
    title varchar(150) not null check (length(trim(title)) > 0),
    budget numeric(12,2) not null check (budget >= 0),
    start_date date not null,
    duration_days integer not null check (duration_days > 0)
);

create table tasks (
    id integer generated always as identity primary key,
    title varchar(200) not null check (length(trim(title)) > 0),
    estimated_cost numeric(12,2) not null check (estimated_cost >= 0),
    due_date date not null,
    priority integer not null check (priority between 1 and 5),
    project_id integer not null,
    foreign key (project_id) references projects (id) on delete restrict
);

create index idx_tasks_project_id_id on tasks (project_id, id);

insert into projects (
    title,
    budget,
    start_date,
    duration_days
)
select
    'Проект ' || n,
    100000.00 + n * 1000,
    date '2026-10-01' + ((n - 1) % 30),
    30 + ((n - 1) % 90)
from generate_series(1, 500) as series(n)
order by n;

with numbered_projects as (
    select
        id,
        ROW_NUMBER() over (order by id) as position
    from projects
)
insert into tasks (
    project_id,
    title,
    estimated_cost,
    due_date,
    priority
)
select
    p.id,
    'Задача ' || n,
    1000.00 + ((n - 1) % 100) * 250,
    date '2026-11-01' + ((n - 1) % 60),
    1 + ((n - 1) % 5)
from generate_series(1, 2500) as series(n)
join numbered_projects as p
    on p.position = case
        when n <= 100 then 1
        else 2 + ((n - 101) % 498)
    end;

commit;