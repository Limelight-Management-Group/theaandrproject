DROP DATABASE IF EXISTS theaandrproject;

CREATE DATABASE theaandrproject;

\c theaandrproject


DROP TABLE IF EXISTS musicpros;
CREATE TABLE musicpros(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL UNIQUE,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT,
user_sid TEXT UNIQUE
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL UNIQUE,
messages TEXT,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT,
user_sid TEXT UNIQUE
);

DROP TABLE IF EXISTS artists;
CREATE TABLE artists(
id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL UNIQUE,
password TEXT,
occupation TEXT,
limelightObjective TEXT,
f_name TEXT,
l_name TEXT,
image BYTEA,
email TEXT,
age INTEGER,
location TEXT,
bio TEXT,
user_sid TEXT UNIQUE
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages(
id SERIAL PRIMARY KEY,
message TEXT,
sender TEXT REFERENCES users(username),
reciever TEXT REFERENCES users(username),
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

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




