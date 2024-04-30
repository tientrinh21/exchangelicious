use exchangeDB;
-- reset the tables metioned in this file
drop table if exists partner_universities_table;
drop table if exists exchange_university_table;
drop table if exists user_table;
drop table if exists university_table;
drop table if exists info_page_table;
drop table if exists favorites_table;
drop table if exists review_table;


-- uuid is 36 characters
-- TODO: Add not null or nullable to everything

-- This table probably needs to change
-- How to format the text?
create table info_page_table (
	info_page_id varchar(36) default (uuid()) primary key,
  webpage TEXT,
  introduction TEXT,
  location TEXT,
  semester TEXT
    -- intro_source varchar(255)
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

create table university_table (
    university_id varchar(36) default (uuid()) primary key,
    country_code char(3),
    region varchar(40), -- Is this the correct way to do this?
    long_name varchar(255),
    info_page_id varchar(36),
	constraint country_code_fk_con
        foreign key (country_code) references country_table (country_code)
        on delete set null on update cascade,
    constraint info_page_id_fk_con
		foreign key (info_page_id) references info_page_table (info_page_id)
);

-- Many-to-Many relation
create table partner_universities_table (
	id varchar(36) default (uuid()) primary key,
    -- Not all partnerships har bilateral, this always for unidirectional partnerships
    -- From means home uni
    from_university_id varchar(36), 
    to_university_id varchar(36),
	-- If university.university_id gets deleted, deleate all accorences of that university in this table
	-- same with update
	constraint from_university_id_fk_con
        foreign key (from_university_id) references university_table (university_id)
        on delete cascade on update cascade,
	constraint to_university_id_fk_con
        foreign key (to_university_id) references university_table (university_id)
        on delete cascade on update cascade
);

CREATE TABLE user_table
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
        foreign key (home_university) references university_table (university_id)
        on delete set null on update cascade,
	constraint nationality_fk_con
        foreign key (nationality) references country_table (country_code)
        on delete set null on update cascade
    -- FOREIGN KEY (exchangeUniversity) REFERENCES University(UniversityID), 
    -- FOREIGN KEY (nationality) REFERENCES Country(countryCode)
);

-- Some stundents exchanges to multiple universities
-- And a university has many exchange students
-- Therefore many-to-many
create table exchange_university_table (
	id varchar(36) default (uuid()) primary key,
    user_id varchar(36) not null,
    university_id varchar(36) not null,
	constraint user_id_fk_con
        foreign key (user_id) references user_table (user_id)
        on delete cascade on update cascade,
	constraint university_id_fk_con
        foreign key (university_id) references university_table (university_id)
        on delete cascade on update cascade
);

-- Many-to-Many
-- https://dba.stackexchange.com/questions/74627/difference-between-on-delete-cascade-on-update-cascade-in-mysql
-- ^ ON DELETE CASCADE ON UPDATE CASCADE
/*
CREATE TABLE favorites (
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
insert into nfoPage(info_page_id, intro_text, intro_source, semester_text, 
	semester_source, application_text, application_source, courses_text, 
    courses_source, tuition_text, tuition_source, housing_text, housing_source,
    visa_text, visa_source) values
('ntnuInfo', ''),
;
*/
insert into info_page_table(info_page_id, webpage, introduction, location, semester) values
(
    "skku_page",
    "https://www.skku.edu/eng/",
    "Sungkyunkwan University is a national university with 625 years of glorious history and shining tradition and is a representative symbol of a leading university which leads the new era. At the same time, the university has led the development of higher education in Korea by challenging and innovating with a mind for sharing and coexistence. We strive to newly form our own brand worthy of our name which actively embraces global social issues through pioneering of global management.",
    "Seoul, officially Seoul Special City, and formerly known as Hanseong and Keijō, is the capital of the Republic of Korea (ROK), commonly known as South Korea, and the country's most extensive urban center. The broader Seoul Capital Area, encompassing Gyeonggi province and Incheon metropolitan city, emerged as the world's fourth largest metropolitan economy in 2014, trailing only Tokyo, New York City, and Los Angeles, hosting more than half of South Korea's population. Although Seoul's population peaked at slightly over 10 million, it has gradually decreased since 2014, standing at approximately 9.97 million residents as of 2020. Seoul is the seat of the South Korean government.",
    "The academic year starts in August and ends in June.\nAutumn semester: early/medio August - 19-22 December\nSpring semester: early January - early June"
),
(
    "ntnu_page",
    "https://www.ntnu.edu/studies/exchange",
    "NTNU started a University that focused on STEM, however it has evolved to broaden its study programs. Around half the study-mass studies within the field of science and technology. (source: https://www.ntnu.edu/facts)",
    "Norway is beautiful bla, bla\nTechnology bla, bla\n3 cities bla, bla, bla\nTrondheim is Norway's third largest city with around 200 000 residents. The city is known as a student city and has a active student community with loads of students clubs and sports clubs you are encourage to join.\nAround 37 000 students",
    "The academic year starts in August and ends in June.\nAutumn semester: early/medio August - 19-22 December\nSpring semester: early January - early June"
),
(
    "uio_page",
    "https://www.uio.no/english/",
    "Founded in 1811, UiO is the countrys largest and oldest university, renowned for its world-class research and commitment to scholarly advancement. At UiO, students have access to a wide range of programs across disciplines, including humanities, social sciences, natural sciences, law, and medicine.",
    "Norway is beautiful bla, bla\nTechnology bla, bla\n3 cities bla, bla, bla\nTrondheim is Norway's third largest city with around 200 000 residents. The city is known as a student city and has a active student community with loads of students clubs and sports clubs you are encourage to join.\nAround 37 000 students",
    "The academic year starts in August and ends in June.\nAutumn semester: early/medio August - 19-22 December\nSpring semester: early January - early June"
),
(
    "uib_page",
    "https://www.uib.no/en",
    "The University of Bergen (UiB) stands proudly on Norways picturesque western coast, overlooking the stunning fjords and surrounded by breathtaking natural beauty. The university was established in 1946.",
    "Norway is beautiful bla, bla\nTechnology bla, bla\n3 cities bla, bla, bla\nTrondheim is Norway's third largest city with around 200 000 residents. The city is known as a student city and has a active student community with loads of students clubs and sports clubs you are encourage to join.\nAround 37 000 students",
    "The academic year starts in August and ends in June.\nAutumn semester: early/medio August - 19-22 December\nSpring semester: early January - early June"
);

insert into university_table(university_id, long_name, country_code, region, info_page_id) values
('skku', 'Sungkyunkwan University - SKKU', 'KOR', 'Seoul, Suwon', 'skku_page'),
('ntnu', 'Norwegian University of Science and Technology - NTNU', 'NOR', 'Trondheim, Gjøvik, Ålesund', 'ntnu_page'),
('uio', 'University of Oslo - UiO', 'NOR', 'Oslo', 'uio_page'),
('uib', 'University of Bergen - UiB', 'NOR', 'Bergen', 'uib_page'),
('uib1', 'University of Bergen - UiB - 1', 'NOR', 'Bergen', 'uib_page'),
('uib2', 'University of Bergen - UiB - 2', 'NOR', 'Bergen', 'uib_page'),
('uib3', 'University of Bergen - UiB - 3', 'NOR', 'Bergen', 'uib_page'),
('uib4', 'University of Bergen - UiB - 4', 'NOR', 'Bergen', 'uib_page'),
('uib5', 'University of Bergen - UiB - 5', 'NOR', 'Bergen', 'uib_page'),
('uib6', 'University of Bergen - UiB - 6', 'NOR', 'Bergen', 'uib_page'),
('uib7', 'University of Bergen - UiB - 7', 'NOR', 'Bergen', 'uib_page'),
('uib8', 'University of Bergen - UiB - 8', 'NOR', 'Bergen', 'uib_page'),
('uib9', 'University of Bergen - UiB - 9', 'NOR', 'Bergen', 'uib_page'),
('uib10', 'University of Bergen - UiB - 10', 'NOR', 'Bergen', 'uib_page');

insert into partner_universities_table(id, from_university_id, to_university_id) values
('skku-ntnu', 'skku', 'ntnu'),
('skku-uio', 'skku', 'uio'),
('skku-uib', 'skku', 'uib'),
('ntnu-ntnu', 'ntnu', 'skku')
;

insert into user_table(user_id, username, pwd, nationality, home_university) values
('kk', 'kari', '123', 'NOR', 'ntnu'),
('oo', 'ola', '123456', 'NOR', 'uio' ),
('pp', 'per', '123', 'NOR', 'ntnu');

insert into exchange_university_table(id, user_id, university_id) values
('aaa', 'pp', 'skku')
;






