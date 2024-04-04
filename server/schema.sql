CREATE TABLE User
(
    userID INTEGER PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    nationality VARCHAR(3), 
    homeUniversity INTEGER,
    exchangeUniversity INTEGER,
    UNIQUE(username),
    FOREIGN KEY (homeUniversity) REFERENCES University(UniversityID)
    FOREIGN KEY (exchangeUniversity) REFERENCES University(UniversityID)
    FOREIGN KEY (nationality) REFERENCES Country(countryCode)
);

CREATE TABLE University (
    universityID INTEGER PRIMARY KEY,
    countryCode VARCHAR(3),
    longName VARCHAR(255),
    infoPageID INTEGER,
    FOREIGN KEY (infoPageID) REFERENCES InfoPage(infoPageID)
    FOREIGN KEY (countryCode) REFERENCES Country(countryCode)
);

-- Many-to-Many
-- https://dba.stackexchange.com/questions/74627/difference-between-on-delete-cascade-on-update-cascade-in-mysql
-- ^ ON DELETE CASCADE ON UPDATE CASCADE
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
)

CREATE TABLE InfoPage (
    infoPageID INTEGER AUTO_INCREMENT,
    introText TEXT,
    semesterText TEXT,
    applicationText TEXT,
    coursesText TEXT,
    tuitionText TEXT,
    housingText TEXT,
    visaText TEXT,
    PRIMARY KEY (infoPageID)
)



