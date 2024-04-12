-- drop database if exists exchangeDB;
-- create database exchangeDB;
use exchangeDB;
-- reset the tables metioned in this file
drop table if exists PartnerUniversitiesTable;
drop table if exists ExchangeUniversityTable;
drop table if exists UserTable;
drop table if exists UniversityTable;
drop table if exists InfoPageTable;
drop table if exists FavoritesTable;
drop table if exists ReviewTable;


-- uuid is 36 characters
-- TODO: Add not null or nullable to everything

-- This table probably needs to change
-- How to format the text?
create table InfoPageTable (
	info_page_id varchar(36) default (uuid()) primary key,
	intro_text TEXT,
    intro_source varchar(255)
    -- semester_text TEXT,
    -- semester_source varchar(255),
    -- application_text TEXT,
    -- application_source varchar(255),
    -- courses_text TEXT,
    -- courses_source varchar(255),
    -- tuition_text text,
    -- tuition_source varchar(255),
    -- housing_text TEXT,
    -- housing_source varchar(255),
	-- visa_text TEXT,
    -- visa_source varchar(255)
);

create table UniversityTable (
    university_id varchar(36) default (uuid()) primary key,
    country_code char(3),
    region varchar(40), -- Is this the correct way to do this?
    long_name varchar(255),
    info_page_id varchar(36),
	constraint country_code_fk_con
        foreign key (country_code) references CountryTable (country_code)
        on delete set null on update cascade,
    constraint info_page_id_fk_con
		foreign key (info_page_id) references InfoPageTable (info_page_id)
);

-- Many-to-Many relation
create table PartnerUniversitiesTable (
	id varchar(36) default (uuid()) primary key,
    -- Not all partnerships har bilateral, this always for unidirectional partnerships
    -- From means home uni
    from_university_id varchar(36), 
    to_university_id varchar(36),
	-- If university.university_id gets deleted, deleate all accorences of that university in this table
	-- same with update
	constraint from_university_id_fk_con
        foreign key (from_university_id) references UniversityTable (university_id)
        on delete cascade on update cascade,
	constraint to_university_id_fk_con
        foreign key (to_university_id) references UniversityTable (university_id)
        on delete cascade on update cascade
);

CREATE TABLE UserTable
(
	user_id varchar(36) default (uuid()) PRIMARY KEY,
    username varchar(40) unique,
    -- Need to fix some password security
    pwd varchar(30),
    nationality char(3),
    home_university varchar(40),
    -- UNIQUE(username),
	constraint home_university_fk_con
    -- if the home university is deleted, then home_university should be set to null
    -- if the home university is updated, then update the relevant info in this table too
        foreign key (home_university) references UniversityTable (university_id)
        on delete set null on update cascade,
	constraint nationality_fk_con
        foreign key (nationality) references CountryTable (country_code)
        on delete set null on update cascade
    -- FOREIGN KEY (exchangeUniversity) REFERENCES University(UniversityID), 
    -- FOREIGN KEY (nationality) REFERENCES Country(countryCode)
);

-- Some stundents exchanges to multiple universities
-- And a university has many exchange students
-- Therefore many-to-many
create table ExchangeUniversityTable (
	id varchar(36) default (uuid()) primary key,
    user_id varchar(36) not null,
    university_id varchar(36) not null,
	constraint user_id_fk_con
        foreign key (user_id) references UserTable (user_id)
        on delete cascade on update cascade,
	constraint university_id_fk_con
        foreign key (university_id) references UniversityTable (university_id)
        on delete cascade on update cascade
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
*/

/*
insert into InfoPage(info_page_id, intro_text, intro_source, semester_text, 
	semester_source, application_text, application_source, courses_text, 
    courses_source, tuition_text, tuition_source, housing_text, housing_source,
    visa_text, visa_source) values
('ntnuInfo', ''),
;
*/
insert into InfoPageTable(info_page_id, intro_text, intro_source) values
('skku_page', 'This is SKKU. ', 'edu.skku.com'),
('ntnu_page', 'NTNU started a University that focused on STEM, however it has evolved to broaden its study programs. Around half the study-mass studies within the field of science and technology.', 'https://www.ntnu.edu/facts'),
('uio_page', 'Founded in 1811, UiO is the countrys largest and oldest university, renowned for its world-class research and commitment to scholarly advancement. At UiO, students have access to a wide range of programs across disciplines, including humanities, social sciences, natural sciences, law, and medicine.', 'uio.no'),
('uib_page', 'The University of Bergen (UiB) stands proudly on Norways picturesque western coast, overlooking the stunning fjords and surrounded by breathtaking natural beauty. The university was established in 1946. ', 'uib.no')
;

insert into UniversityTable(university_id, long_name, country_code, region, info_page_id) values
('skku', 'Sungkyunkwan university - SKKU', 'KOR', 'Seoul, Suwon', 'skku_page'),
('ntnu', 'Norwegian University of Science and Technology - NTNU', 'NOR', 'Trondheim, Gjøvik, Ålesund', 'ntnu_page'),
('uio', 'University of Oslo - UiO', 'NOR', 'Oslo', 'uio_page'),
('uib', 'University of Bergen - UiB', 'NOR', 'Bergen', 'uib_page');

insert into PartnerUniversitiesTable(id, from_university_id, to_university_id) values
('skku-ntnu', 'skku', 'ntnu'),
('skku-uio', 'skku', 'uio'),
('skku-uib', 'skku', 'uib'),
('ntnu-ntnu', 'ntnu', 'skku')
;

insert into UserTable(user_id, username, pwd, nationality, home_university) values
('kk', 'kari', '123', 'NOR', 'ntnu'),
('oo', 'ola', '123456', 'NOR', 'uio' ),
('pp', 'per', '123', 'NOR', 'ntnu');

insert into ExchangeUniversityTable(id, user_id, university_id) values
('aaa', 'pp', 'skku')
;





