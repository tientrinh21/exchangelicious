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
  semester TEXT,
  application_deadline TEXT,
  courses TEXT,
  housing TEXT,
  tuition TEXT,
  visa TEXT,
  eligibility TEXT,
  requirements TEXT
);

create table university_table (
  university_id varchar(36) default (uuid()) primary key,
  country_code char(3),
  region varchar(40), -- Is this the correct way to do this?
  long_name varchar(255),
  info_page_id varchar(36),
  ranking varchar(10),
  housing boolean,
  campus varchar(255),
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

DELIMITER //

-- CREATE TRIGGER before_uni_insert
-- BEFORE INSERT ON university_table
-- FOR EACH ROW
-- BEGIN
--     DECLARE var varchar(10);
--     SELECT uni_rank INTO var
--     FROM uni_ranking_table
--     WHERE uni_name = NEW.long_name
--     LIMIT 1;

--     SET NEW.ranking = var;
-- END//
CREATE TRIGGER before_uni_insert
BEFORE INSERT ON university_table
FOR EACH ROW
BEGIN
    DECLARE var varchar(10);
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
    DECLARE var varchar(10);
    SELECT uni_rank INTO var
    FROM uni_ranking_table
    WHERE uni_name LIKE CONCAT('%', NEW.long_name, '%')
    LIMIT 1;

    SET NEW.ranking = var;
END//



DELIMITER ;

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

insert into info_page_table(info_page_id, webpage, introduction, location, semester, application_deadline, courses, housing, tuition, visa, eligibility, requirements) values
  (
  "fe5c72da-bf4c-4e8d-9851-903de8fe7d01",
  "https://www.skku.edu/eng/",
  "Sungkyunkwan University is a national university with 625 years of glorious history and shining tradition and is a representative symbol of a leading university which leads the new era. At the same time, the university has led the development of higher education in Korea by challenging and innovating with a mind for sharing and coexistence. We strive to newly form our own brand worthy of our name which actively embraces global social issues through pioneering of global management.",
  "Seoul, officially Seoul Special City, and formerly known as Hanseong and Keijō, is the capital of the Republic of Korea (ROK), commonly known as South Korea, and the country's most extensive urban center. The broader Seoul Capital Area, encompassing Gyeonggi province and Incheon metropolitan city, emerged as the world's fourth largest metropolitan economy in 2014, trailing only Tokyo, New York City, and Los Angeles, hosting more than half of South Korea's population. Although Seoul's population peaked at slightly over 10 million, it has gradually decreased since 2014, standing at approximately 9.97 million residents as of 2020. Seoul is the seat of the South Korean government.",
  "The academic year starts in August and ends in June.
  
  Autumn semester: early/medio August - 19-22 December
  
  Spring semester: early January - early June",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
  ),
  (
  "ef3d8c9a-5482-4a70-888d-e739ad31f5da",
  "https://www.ntnu.edu/studies/exchange",
  "NTNU in Numbers: approximate 9,000 employees and 42,000 students.

NTNU started a University that focused on STEM, however it has evolved to broaden its study programs. Around half the study-mass studies within the field of science and technology. (source: [https://www.ntnu.edu/facts](https://www.ntnu.edu/facts))",
  "NTNU has campuses in 3 cities: Trondheim, Ålesund, and Gjøvik

Trondheim is Norway's third largest city with around 200 000 residents. The city is known as a student city and has a active student community with loads of students clubs and sports clubs you are encourage to join.

Ålesund is a picturesque coastal town nestled amidst the stunning fjords of Norway. With its proximity to the sea and surrounding mountains, outdoor enthusiasts will find themselves in paradise. From hiking and skiing to kayaking and fishing, there's no shortage of adventures to be had in Ålesund's backyard. You will also be able to see the Northern lights dancing across the sky.

Population (municipality): around 68,000",
  "The academic year starts in August and ends in June.

Autumn semester: early/medio August - 19-22 December

Spring semester: early January - early June

Source:
[https://i.ntnu.no/studiekalender](https://i.ntnu.no/studiekalender)",
  "",
  "### How to find courses

Course information:

[https://www.ntnu.edu/web/studies/exchange/courses](https://www.ntnu.edu/web/studies/exchange/courses)

The main language of instruction is Norwegian. However NTNU provides quite a lot of courses in English, especially on graduate level.

You can find the course catalog here:

Remember to filter on the correct city and language.

[Courses - NTNU](https://www.ntnu.edu/studies/coursesearch#alesund=false&gjovik=false&trondheim=true&english=true&semester=2023&faculty=-1&institute=-1&multimedia=false&phd=false&open=false&courseAutumn=false&courseSpring=false&courseSummer=false&pageNo=1&season=spring&sortOrder=ascTitle)

The course catalog

https://www.ntnu.edu/studies/courses

### How to register for courses

The system works similarly for all universities in Norway.

After admission, exchange students register for courses in Studentweb (an online webportal). The online course registration opens 1 December for courses in the spring semester and 1 June for courses in autumn (4 June in 2024 since 1 June is a Saturday).

You can register for as many courses as you want. Some courses may required you to be amitted to a certain study program to be able to register for.

It depends on the study program, but the average bachelor student will have 4 courses each semester. Each worth the same amount of study points (7.5 Norwegian study points).",
  "Trondheim

The majority of student villages in Trondheim are run by the **Student Welfare Organization (Sit)**. Due to limited amount of Sit housing in Trondheim, **most students will have to find accommodation on the [private market](https://www.ntnu.edu/lifeandhousing/trondheim/private-housing)**. The only students guaranteed housing at Sit in the spring semester are students from **outside** the EU/EEA/EFTA, and non-Nordic students admitted to an international master's degree at NTNU.

The norm is to share a flat with flatmates. So you have your own bedroom, but share the bedroom, kitchen and common areas with other students. You can also rent your own single apartment, if you are willing to pay more rent.

The monthly rent is somewhere around 4500 NOK - 7000 NOK.

[https://www.ntnu.edu/lifeandhousing/trondheim/housing](https://www.ntnu.edu/lifeandhousing/trondheim/housing)

Housing - Gjøvik",
  "Tuition fees will be charged to international students with citizenship from outside the EU/EEA or Switzerland beginning in the autumn semester of 2023. Exchange students from NTNU's partner universities are exempt from the tuition fee.

NTNU does not offer any scholarships that cover tuition fees.

Tuition fee depends heavily on the study program and level of study. Here are some examples:

| Study program                                                                                                                                                                                       | Bachelor             | Masters              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------- |
| Medical studies, NTNU Art Academy                                                                                                                                                                   | 501 100 NOK per year | 521 300 NOK per year |
| Music performance, architecture and design studies, Clinical psychology                                                                                                                             | 382 500 NOK per year | 397 700 NOK per year |
| Science and technology studies, graduate level                                                                                                                                                      | 261 000 NOK per year | 271 100 NOK per year |
| Graduate level studies in humanities, social sciences, economics, technology. Five year teacher's education. Several health studies on undergraduate level and in continuing professional education | 189 400 NOK per year | 197 000 NOK per year |
| Undergraduate level science, technology and teacher's studies. Nursing, Social Education, Child Protection and Welfare                                                                              | 160 800 NOK per year | 166 900 NOK per year |

Source:

[https://www.ntnu.edu/studies/tuition-fee](https://www.ntnu.edu/studies/tuition-fee) ",
  " If you come from a country outside the EU/EEA and you wish to study or go to school in Norway for more than three months, you must apply for a study permit. If you are granted a study permit, you will also be able to work for up to 20 hours a week while you are studying and full-time during holidays.

You can read more about the process and apply on The Norwegian Directorate of Immigration (UDI) webpage: [https://www.udi.no/en/](https://www.udi.no/en/)",
  "",
  ""
  ),
  (
  "a2bc84b3-0fef-4e0d-a9da-019812338ab7",
  "https://www.uio.no/english/",
  "Founded in 1811, UiO is the countrys largest and oldest university, renowned for its world-class research and commitment to scholarly advancement. At UiO, students have access to a wide range of programs across disciplines, including humanities, social sciences, natural sciences, law, and medicine.",
  "Oslo, the capital of Norway, is a vibrant city where modernity meets rich cultural heritage. Set against the backdrop of the Oslofjord and surrounded by lush forests, Oslo offers a perfect blend of urban excitement and natural tranquility. Explore its bustling streets lined with trendy cafes, boutiques, and museums, including the iconic Viking Ship Museum and the striking Opera House. Immerse yourself in the city's diverse culinary scene, from traditional Norwegian delicacies to international flavors. Whether you're strolling through the historic streets of Karl Johans gate or hiking in the nearby forests, Oslo captivates with its beauty, charm, and endless opportunities for adventure.",
  "The academic year starts in August and ends in June.
  
Autumn semester: early/medio August - 19-22 December
  
Spring semester: early January - early June",
  "Applications should be completed online well before:

- **1 May** for studies starting in the autumn semester (August - December or August - June)
- **15 October** for studies starting in the spring semester (January - May or January - December)

source: [https://www.uio.no/english/studies/admission/exchange/application.html](https://www.uio.no/english/studies/admission/exchange/application.html)",
  "### How to find courses

The main language of instruction is Norwegian. However, UIO offers a wide range of courses in English.

[https://www.uio.no/english/studies/courses/](https://www.uio.no/english/studies/courses/)

### How to register for courses

The system works similarly for all universities in Norway. 

After admission, exchange students register for courses in Studentweb (an online webportal). The online course registration opens 1 December for courses in the spring semester and 1 June for courses in autumn (4 June in 2024 since 1 June is a Saturday).

You can register for as many courses as you want. Some courses may required you to be amitted to a certain study program to be able to register for. 

It depends on the study program, but the average bachelor student will have 3 courses each semester. Each worth the same amount of study points (10 Norwegain study points).",
  "source: [https://www.uio.no/english/studies/international-students/before-arrival/housing/](https://www.uio.no/english/studies/international-students/before-arrival/housing/)

The majority of student villages in Oslo are run by the=**Student Welfare Organization (SiO)**. 

The number of available student housing units in Oslo is limited. Incoming exchange students and international master students will be on UiOs prioritised housing list, given they apply for single housing within the deadline.",
  "source: [https://www.uio.no/english/studies/admission/tuition/](https://www.uio.no/english/studies/admission/tuition/)

Tuition fees will be charged to international students with citizenship from outside the EU/EEA or Switzerland beginning in the autumn semester of 2023. Exchange students from UIO's partner universities are exempt from the tuition fee.  

UIO does not offer any scholarships that cover tuition fees.

Tuition fee depends heavily on the study program and level of study. But it lies between

191,000 - 276,000 NOK per year.",
  "If you come from a country outside the EU/EEA and you wish to study or go to school in Norway for more than three months, you must apply for a study permit. If you are granted a study permit, you will also be able to work for up to 20 hours a week while you are studying and full-time during holidays.

You can read more about the process and apply on The Norwegian Directorate of Immigration (UDI) webpage: [https://www.udi.no/en/](https://www.udi.no/en/)",
  "",
  ""
  ),
  (
  "a664f903-2323-4f43-b390-f659a43be3b7",
  "https://www.uib.no/en",
  "The University of Bergen (UiB) stands proudly on Norways picturesque western coast, overlooking the stunning fjords and surrounded by breathtaking natural beauty. The university was established in 1946.",
  "As Norway's second-largest city, Bergen is a vibrant hub of activity, offering a unique blend of old-world charm and modern sophistication. Its colorful wooden houses, cobblestone streets, and historic Hanseatic wharf, simply known as Bryggen, transport visitors back in time to the days of the medieval trading empire.

Surrounded by majestic mountains and overlooking the sparkling waters of the North Sea, Bergen is often referred to as the 'Gateway to the Fjords' due to its proximity to some of Norway's most breathtaking natural wonders. 

Just remember to bring an umbrella.",
  "The academic year starts in August and ends in June.

Autumn semester: early/medio August - 19-22 December

Spring semester: early January - medio June

Source: [https://www.uib.no/en/education/49211/semester-dates](https://www.uib.no/en/education/49211/semester-dates)",
  "",
  "Source: [https://www.uib.no/en/exchange-courses](https://www.uib.no/en/exchange-courses)

### How to register courses

The system works similarly for all universities in Norway. 

After admission, exchange students register for courses in Studentweb (an online webportal). The online course registration opens 1 December for courses in the spring semester and 1 June for courses in autumn (4 June in 2024 since 1 June is a Saturday).

You can register for as many courses as you want. Some courses may required you to be amitted to a certain study program to be able to register for. 

It depends on the study program, but the average bachelor student will have 3-4 courses each semester. Each worth the same amount of study points (10/7.5 Norwegain study points).",
  "Source: [https://www.uib.no/en/education/49447/student-housing#how-to-apply-for-accommodation-with-housing-guarantee](https://www.uib.no/en/education/49447/student-housing#how-to-apply-for-accommodation-with-housing-guarantee)

New international students admitted to the University of Bergen can apply for housing through the Student Welfare Organization (Sammen).

Exchange students are guaranteed housing.

*Housing guarantee ensures a space in a student hostel. A specific room type/location is not guaranteed. Allocations are randomised.

**Please note:**

- Shared rooms will be allocated to short term students.
- Family and couple apartments are not included in the housing guarantee.
- Pets are not allowed at SAMMEN's buildings (guide dogs are exempted).",
  "",
  "If you come from a country outside the EU/EEA and you wish to study or go to school in Norway for more than three months, you must apply for a study permit. If you are granted a study permit, you will also be able to work for up to 20 hours a week while you are studying and full-time during holidays.

You can read more about the process and apply on The Norwegian Directorate of Immigration (UDI) webpage: [https://www.udi.no/en/](https://www.udi.no/en/)",
  "",
  ""
  ),
  (
  "9f2cea0c-9c0c-4566-92e0-e4b55c02af9b",
  "https://ie.utdallas.edu/education-abroad/incoming-exchange",
  "Created by bold visionaries and tech pioneers, UT Dallas has nurtured generations of innovators in its first 50 years. Our roots go back to the 1960s when the three founders of Texas Instruments — Eugene McDermott, Erik Jonsson and Cecil Green — established the Graduate Research Center of the Southwest as a source of advanced research and trained scientists to benefit the state and the nation. Our creativity and enterprising spirit has been — and will continue to be — UT Dallas' guiding light.

Numbers: More than 31,000 students and 132,000 graduates.

Source: [https://www.utdallas.edu/about-us/](https://www.utdallas.edu/about-us/)",
  "**Richardson** is a city in [Dallas](https://en.wikipedia.org/wiki/Dallas_County,_Texas) and [Collin](https://en.wikipedia.org/wiki/Collin_County,_Texas) counties in the [U.S. state](https://en.wikipedia.org/wiki/U.S._state) of [Texas](https://en.wikipedia.org/wiki/Texas). As of the [2020 United States census](https://en.wikipedia.org/wiki/2020_United_States_census), the city had a total population of 119,469. Richardson is an [inner suburb](https://en.wikipedia.org/wiki/Inner_suburbs) of the city of [Dallas](https://en.wikipedia.org/wiki/Dallas).

It is home to the [University of Texas at Dallas](https://en.wikipedia.org/wiki/University_of_Texas_at_Dallas) and the [Telecom Corridor](https://en.wikipedia.org/wiki/Telecom_Corridor), with a high concentration of telecommunications companies. More than 5,000 businesses have operations within Richardson's 28 square miles (73 km2), including many of the world's largest telecommunications and networking companies, such as [AT&T]([https://en.wikipedia.org/wiki/AT%26T_Inc.)](https://en.wikipedia.org/wiki/AT%26T_Inc.)), [Verizon](https://en.wikipedia.org/wiki/Verizon), [Cisco Systems](https://en.wikipedia.org/wiki/Cisco_Systems), [Samsung](https://en.wikipedia.org/wiki/Samsung), [ZTE](https://en.wikipedia.org/wiki/ZTE), [MetroPCS](https://en.wikipedia.org/wiki/MetroPCS), [Texas Instruments](https://en.wikipedia.org/wiki/Texas_Instruments), [Qorvo](https://en.wikipedia.org/wiki/Qorvo), and [Fujitsu](https://en.wikipedia.org/wiki/Fujitsu). Richardson's largest employment base is provided by the insurance industry, with [Blue Cross and Blue Shield of Texas](https://en.wikipedia.org/wiki/Blue_Cross_and_Blue_Shield_of_Texas)'s headquarters, a regional hub for the insurance company [GEICO](https://en.wikipedia.org/wiki/GEICO), regional offices for [United Healthcare](https://en.wikipedia.org/wiki/United_Healthcare), and one of [State Farm Insurance](https://en.wikipedia.org/wiki/State_Farm_Insurance)'s three national regional hubs located in the community.

Source: [https://en.wikipedia.org/wiki/Richardson,_Texas](https://en.wikipedia.org/wiki/Richardson,_Texas)",
  "The academic year begins in August (Fall Semester) and ends in May (Spring Semester)

- Spring Semester: mid January - mid May
- Fall Semester: mid August - mid December

Source: [https://www.utdallas.edu/academics/calendar/](https://www.utdallas.edu/academics/calendar/)",
  "Nomination deadline:

- Fall Semester - early April
- Spring Semester - early September

Application deadline:

- Fall Semester - early May
- Spring Semester - early October

Source: [https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4](https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4)",
  "Source: [https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4](https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4)

### How to find courses

Students may choose any open classes that they are eligible for in the course book
[coursebook.utdallas.edu](http://coursebook.utdallas.edu/)

- Undergraduate students are generally not permitted to take graduate courses.
- Some courses which are in high demand (especially courses in the school of Engineering and Computer Science).",
  "Estimate of Living Expenses: $9,000 per semester (including housing, food, books, transportation, and other costs)

Arrangements are made for exchange students to live in furnished on-campus apartments. See details and price at: [housing.utdallas.edu](http://housing.utdallas.edu/)

Source: [https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4](https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4)",
  "- Exchange Application and Foreign Credential Fee - $150
- International Student Fee - $150
- International Orientation Fee - $50
- Health Insurance Fee - $1,500 (approx.)
- Transcript Fee - $10 (end of semester)
- Housing (Application Fee required) - Cost varies

Source: [https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4](https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4)",
  "Exchange students coming to the US to study must apply for a J-1 visa and will need a DS-2019 from UT Dallas.
See the International Students and Scholars Office (ISSO) website for more information: [http://isso.utdallas.edu/j-1](http://isso.utdallas.edu/j-1)

Source: [https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4](https://utdallas.box.com/s/aa0wbsjdkpm7kuvrm5pxybhsg00svgi4)",
  "- Language:
    - Completion of Level 112 at an ELS Language Center
    - Duolingo English Test: Minimum score: 105
    - International English Language Testing System, Academic (IELTS): Minimum score: 6.5
    - Pearson Test of English, Academic: Minimum score: 67
    - Test of English as a Foreign Language iBT (Internet-based test): Minimum score: 80
    - Test of English as a Foreign Language (TOEFL) IBT (including the Home Edition and Paper Edition): Minimum score: 80
- Minimum GPA: 3.0/4.0",
  "- Graduate student acceptance: yes
- Minimum credits to take:
    - Undergraduate - 12 credit hours
    - Graduate - 9 credit hours
- Maximum credits to take:
    - Undergraduate - university_table15 credit hours
    - Graduate - 12 credit hours"
  );

insert into university_table(university_id, long_name, country_code, region, info_page_id, campus, housing, ranking) values
  ('7ec48895-84fc-479c-9d9f-94c243148c0d', 'Sungkyunkwan University', 'KOR', 'Seoul, Suwon', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Suwon Campus" , 1, "None"),
  ('82577908-cbee-4b1c-9a98-13efa48be3a7', 'Norwegian University of Science and Technology', 'NOR', 'Trondheim, Gjøvik, Ålesund', 'ef3d8c9a-5482-4a70-888d-e739ad31f5da', "Ålesund Campus", 0, "None"),
  ('b534a0dc-68fd-4d95-a012-a315198fc9d6', 'University of Oslo', 'NOR', 'Oslo', 'a2bc84b3-0fef-4e0d-a9da-019812338ab7', "Oslo Campus", 0, "None"),
  ('0a34e2df-6cb5-43df-bb67-441eac1ea273', 'University of Bergen', 'NOR', 'Bergen', 'a664f903-2323-4f43-b390-f659a43be3b7', "Bergen Campus", 0, "None"),
  ('86a608f2-08ae-45e6-b680-8273680fe129', 'University of Texas at Dallas', 'USA', 'Richardson, Texas', '9f2cea0c-9c0c-4566-92e0-e4b55c02af9b', "Dallas Campus", 1, "None"),
  ('umass_boston', 'University of Massachusetts Boston', 'USA', 'Boston, Massachusetts', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Boston Campus", 1, "None"),
  ('umanitoba', 'University of Manitoba', 'CAN', 'Winnipeg, Manitoba', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Winnipeg Campus", 0, "None"),
  ('utoronto', 'University of Toronto', 'CAN', 'Toronto, Ontarion', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Toronto Campus", 0, "None"),
  ('usask', 'University of Saskatchewan', 'CAN', 'Saskatoon, Saskatchewan', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Saskatoon Campus", 1, "None"),
  ('ntu', 'Nanyang Technological University', 'SGP', 'Nanyang Ave', 'fe5c72da-bf4c-4e8d-9851-903de8fe7d01', "Singapore Campus", 1, "None");
