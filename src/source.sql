CREATE TABLE USERS (ID INT AUTO_INCREMENT PRIMARY KEY, EMAIL VARCHAR(100) NOT NULL UNIQUE, NAME VARCHAR(100) NOT NULL, PROFILE_IMAGE_URL VARCHAR(10000), PASSWORD VARCHAR(255) NOT NULL);

CREATE TABLE BLOGS (ID INT AUTO_INCREMENT PRIMARY KEY, USER_ID INT NOT NULL, TITLE VARCHAR(1000) NOT NULL, SUBTITLE VARCHAR(1000), KEYWORDS VARCHAR(1000), POST_DATETIME DATETIME DEFAULT NOW() ON UPDATE NOW() NOT NULL, CONTENT LONGTEXT NOT NULL, FOREIGN KEY (USER_ID) REFERENCES USERS(ID));

CREATE TABLE COMMENTS (ID INT AUTO_INCREMENT PRIMARY KEY, USER_ID INT NOT NULL, POST_DATETIME DATETIME DEFAULT NOW() NOT NULL, CONTENT TEXT NOT NULL, BLOG_ID INT NOT NULL, FOREIGN KEY (BLOG_ID) REFERENCES BLOGS(ID) ON DELETE CASCADE, FOREIGN KEY (USER_ID) REFERENCES USERS(ID));