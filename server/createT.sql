CREATE TABLE users (
	id VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    pwd VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    homeUni VARCHAR(50),
    exchangeUni VARCHAR(50),
    PRIMARY KEY(id),
    UNIQUE (id, username, email)
);

CREATE TABLE university (
	id VARCHAR(100) PRIMARY KEY NOT NULL,
    longName VARCHAR(100),
    infoPage LONGTEXT,
    courseCatalog BIGINT,
    UNIQUE(id)
);

CREATE TABLE courseReview (
	id VARCHAR(100) NOT NULL PRIMARY KEY,
    courseCode VARCHAR(50),
    txt LONGTEXT,
    moodscore ENUM ('good', 'soso', 'bad')
);

CREATE TABLE review (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES users(id),
    txt LONGTEXT,
    aboutUni VARCHAR(100),     
    courseReview_id VARCHAR(100),
    CONSTRAINT FOREIGN KEY (aboutUni) REFERENCES university(id),
    CONSTRAINT FOREIGN KEY (courseReview_id) REFERENCES courseReview(id)
);

CREATE TABLE partnerUniversities (
	id BIGINT NOT NULL PRIMARY KEY,
    fromUniId VARCHAR(36),
    toUniId VARCHAR(36)
);

-- CREATE TABLE favorites (
-- 	id BIGINT NOT NULL PRIMARY KEY,
--     FOREIGN KEY(id) REFERENCES university(id),
--     FOREIGN KEY(id) REFERENCES user(id)
-- );

-- CREATE TABLE course (
-- 	id BIGINT NOT NULL PRIMARY KEY,
--     code VARCHAR(50),
--     name VARCHAR(50),
--     uni BIGINT REFERENCES university(id),
--     description LONGTEXT
-- );