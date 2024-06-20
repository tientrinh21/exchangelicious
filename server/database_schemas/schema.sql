use exchangeDB;
-- reset the tables metioned in this file
drop table if exists favorite_table;
drop table if exists upvote_table;
drop table if exists downvote_table;
drop table if exists review_table;
drop table if exists user_table;
drop table if exists university_table;
drop table if exists info_page_table;
drop table if exists review_table;
drop trigger if exists update_upvotes_post;
drop trigger if exists update_upvotes_delete;
drop trigger if exists update_downvotes_post;
drop trigger if exists update_downvotes_delete;

create table info_page_table (
  info_page_id varchar(36) default (uuid()) primary key,
  webpage TEXT,
  introduction TEXT,
  location TEXT,
  semester TEXT,
  application_deadlines TEXT,
  courses TEXT,
  expenses TEXT,
  housing TEXT,
  visa TEXT,
  eligibility TEXT,
  requirements TEXT,
  additional_information TEXT
);

create table university_table (
  university_id varchar(36) default (uuid()) primary key,
  country_code char(3),
  region varchar(40),
  long_name varchar(255) unique,
  info_page_id varchar(36),
  ranking varchar(10) default '1500+',
  housing enum('On-campus', 'Off-campus', 'Available' ,'No housing', 'N/A') not null default 'N/A',
  campus ENUM('single', 'multiple', 'N/A') not null default 'N/A',
  constraint country_code_fk_con
    foreign key (country_code) references country_table (country_code)
    on delete set null on update cascade,
  constraint info_page_id_fk_con
    foreign key (info_page_id) references info_page_table (info_page_id)
);

DELIMITER //

CREATE TRIGGER before_uni_insert
BEFORE INSERT ON university_table
FOR EACH ROW
BEGIN
    DECLARE var varchar(10) default '1500+';
    SELECT uni_rank INTO var
    FROM uni_ranking_table
    WHERE uni_name LIKE CONCAT('%', NEW.long_name, '%')
    LIMIT 1;

    SET NEW.ranking = var;
END//

CREATE TRIGGER before_uni_update
BEFORE UPDATE ON university_table
FOR EACH ROW
BEGIN
    DECLARE var varchar(10) default '1500+';
    SELECT uni_rank INTO var
    FROM uni_ranking_table
    WHERE uni_name LIKE CONCAT('%', NEW.long_name, '%')
    LIMIT 1;

    SET NEW.ranking = var;
END//

DELIMITER ;

CREATE TABLE user_table
(
	user_id varchar(36) default (uuid()) PRIMARY KEY,
  username varchar(40) unique,
  pwd varchar(64), 
  salt varchar(32),
  nationality char(3),
  home_university varchar(40),
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

-- Many-to-Many
-- https://dba.stackexchange.com/questions/74627/difference-between-on-delete-cascade-on-update-cascade-in-mysql
-- ^ ON DELETE CASCADE ON UPDATE CASCADE
CREATE TABLE favorite_table (
	favorite_id varchar(36) default (uuid()) PRIMARY KEY,
    user_id varchar(36) not null,
    university_id varchar(36) not null,
	constraint user_id_fk_con_favorite
		foreign key (user_id) references user_table (user_id)
		on delete cascade on update cascade,
	constraint university_id_fk_con_favorite
		foreign key (university_id) references university_table (university_id)
		on delete cascade on update cascade,
	unique key only_one_favorite_connection (user_id, university_id)
);

create table review_table (
	review_id varchar(36) default (uuid()) primary key,
	# A university can have many reviews
    university_id varchar(36) not null,
	user_id varchar(36) not null,
    title varchar(100) not null,
	content text,
    submit_datetime datetime,
    last_edit_datetime datetime,
    mood_score ENUM('very bad', 'bad', 'neutral', 'good', 'very good'),
	upvotes int default 0,
    downvotes int default 0,
	constraint user_id_fk_con_review
		foreign key (user_id) references user_table (user_id)
		on delete cascade on update cascade,
	constraint university_id_fk_con_review
		foreign key (university_id) references university_table (university_id)
		on delete cascade on update cascade
);

create table upvote_table (
	upvote_id varchar(36) default (uuid()) primary key,
    user_id varchar(36) not null,
    review_id varchar(36) not null,
	constraint user_id_up_fk_con
		foreign key (user_id) references user_table (user_id)
		on delete cascade on update cascade,
	constraint review_id_up_fk_con
		foreign key (review_id) references review_table (review_id)
		on delete cascade on update cascade,
	unique key only_one_upvote (user_id, review_id)
);

create table downvote_table (
	downvote_id varchar(36) default (uuid()) primary key,
    user_id varchar(36) not null,
    review_id varchar(36) not null,
	constraint user_id_down_fk_con
		foreign key (user_id) references user_table (user_id)
		on delete cascade on update cascade,
	constraint review_id_down_fk_con
		foreign key (review_id) references review_table (review_id)
		on delete cascade on update cascade,
	unique key only_one_downvote (user_id, review_id)
);

delimiter //

CREATE TRIGGER update_upvotes_post
AFTER INSERT ON upvote_table
FOR EACH ROW
BEGIN
    UPDATE review_table
    SET upvotes = upvotes + 1
    WHERE review_id = NEW.review_id;
END;

//

CREATE TRIGGER update_upvotes_delete
AFTER DELETE ON upvote_table
FOR EACH ROW
BEGIN
    UPDATE review_table
    SET upvotes = upvotes - 1
    WHERE review_id = OLD.review_id;
END;

//

CREATE TRIGGER update_downvotes_post
AFTER INSERT ON downvote_table
FOR EACH ROW
BEGIN
    UPDATE review_table
    SET downvotes = downvotes + 1
    WHERE review_id = NEW.review_id;
END;

//

CREATE TRIGGER update_downvotes_delete
AFTER DELETE ON downvote_table
FOR EACH ROW
BEGIN
    UPDATE review_table
    SET downvotes = downvotes - 1
    WHERE review_id = OLD.review_id;
END;

//
delimiter ;
