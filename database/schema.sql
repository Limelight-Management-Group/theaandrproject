DROP DATABASE IF EXISTS theaandrproject;

CREATE DATABASE theaandrproject;

\c theaandrproject


DROP TABLE IF EXISTS musicpros;
CREATE TABLE musicpros(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT
);

DROP TABLE IF EXISTS artists;
CREATE TABLE artists(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT
);

-- DROP TABLE IF EXISTS messages;
-- CREATE TABLE messages(
-- id SERIAL PRIMARY KEY,
-- title VARCHAR(35),
-- message TEXT,
-- sender INTEGER REFERENCES Users(id),
-- reciever INTEGER REFERENCES Users(id)
-- );

-- DROP TABLE IF EXISTS mentorship;
-- CREATE TABLE mentorship(
-- mentors_id INTEGER REFERENCES Users(id),
-- mentees_id INTEGER REFERENCES Users(id)
-- );

-- DROP TABLE IF EXISTS conversation;
-- CREATE TABLE conversation(
-- messages_id INTEGER PRIMARY KEY, 
-- user_one INTEGER ,
-- user_two INTEGER ,
-- FOREIGN KEY (user_one) REFERENCES users(id),
-- FOREIGN KEY (user_two) REFERENCES users(id)
-- );




