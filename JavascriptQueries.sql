use L5Project

create table users(
	id INT primary key identity(1,1),
	username nvarchar(50)unique,
	email nvarchar(100)unique,
	fname nvarchar(50),
	lname nvarchar(50),
	password nvarchar(50), 
	created_at datetime not null default getdate()
)
insert into users(username, email, fname, lname, password)
values ('mahnoor100','mahnoor@gmail.com', 'Mahnoor','Faisal','mahnoor1010' );

select * from users



drop table users
delete from users where id = '8';

