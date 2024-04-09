drop database if exists exchangeDB;
create database exchangeDB;
use exchangeDB;

CREATE TABLE University (
    university_id varchar(40) default (uuid()) PRIMARY KEY,
    -- countryCode VARCHAR(3), 
    long_name VARCHAR(255),
    info_page_id TEXT
    -- FOREIGN KEY (infoPageID) REFERENCES InfoPage(infoPageID), 
    -- FOREIGN KEY (countryCode) REFERENCES Country(countryCode) 
);

CREATE TABLE User
(
	user_id varchar(40) default (uuid()) PRIMARY KEY,
    username varchar(40) unique,
    password varchar(30),
    -- nationality VARCHAR(3),
    home_university varchar(40),
    -- exchangeUniversity INTEGER, 
    -- UNIQUE(username),
    FOREIGN KEY (home_university) REFERENCES University(university_id)
    -- FOREIGN KEY (exchangeUniversity) REFERENCES University(UniversityID), 
    -- FOREIGN KEY (nationality) REFERENCES Country(countryCode)
);



-- Many-to-Many
-- https://dba.stackexchange.com/questions/74627/difference-between-on-delete-cascade-on-update-cascade-in-mysql
-- ^ ON DELETE CASCADE ON UPDATE CASCADE
/*
CREATE TABLE Favorites (
    user INTEGER NOT NULL,
    university INTEGER NOT NULL,
    PRIMARY KEY (user, university),
    CONSTRAINT user_fk_con
        FOREIGN KEY (user) REFERENCES User (userID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT university_fk_con
        FOREIGN KEY (university) REFERENCES University (universityID)
        ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE InfoPage (
    infoPageID INTEGER AUTO_INCREMENT,
    introText TEXT,
    semesterText TEXT,
    applicationText TEXT,
    coursesText TEXT,
    tuitionText TEuniversityXT,
    housingText TEXT,
    visaText TEXT,
    PRIMARY KEY (infoPageID)
);
*/
insert into University(university_id, long_name, info_page_id) values
('ntnu', 'NTNU', 'Trondheim is best'),
('uio', 'Uio', 'Oslo is best'),
('uib', 'Uib', 'Bergens is best');

insert into User(user_id, username, password, home_university) values
('kk', 'kari', '123', 'ntnu'),
('oo', 'ola', '123456', 'uio' ),
('pp', 'per', '123', 'ntnu');






