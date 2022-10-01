CREATE TABLE USERS (ID VARCHAR(100) PRIMARY KEY, NAME VARCHAR(100) NOT NULL, PROFILE_IMAGE_URL BLOB);

CREATE TABLE BLOGS (ID INT AUTO_INCREMENT PRIMARY KEY, EMAIL VARCHAR(100) NOT NULL, PROFILE_IMAGE_URL VARCHAR(1000), USERNAME VARCHAR(100) NOT NULL, TITLE VARCHAR(1000) NOT NULL, SUBTITLE VARCHAR(1000), KEYWORDS VARCHAR(1000), POST_DATETIME DATETIME DEFAULT NOW() ON UPDATE NOW() NOT NULL, CONTENT LONGTEXT NOT NULL);


<Stack gap={3}>
	<NavigationBar />
	{this.state.showBlog ? <div style={{ display: "flex", justifyContent: "center" }}><div style={{ width: "1080px" }}><BlogView {...this.state.blogData} /></div></div> : <BlogEditor manageData={this.manageData} />} */}
	<BlogEditor manageData={this.manageData} />
	
</Stack>