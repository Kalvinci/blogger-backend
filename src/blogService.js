const { connection } = require("./dbService");

function getBlogList() {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT BLOGS.ID as BLOG_ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.ID ORDER BY POST_DATETIME DESC', function (error, results, fields) {
				if (error) throw error;
				const blogs = []
				if (results.length > 0) {
					for (const blog of results) {
						const { BLOG_ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME } = blog;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const blogData = {
							id: BLOG_ID,
							username: NAME,
							profilePicUrl: PROFILE_IMAGE_URL,
							title: TITLE,
							subTitle: SUBTITLE,
							keywords: KEYWORDS,
							date,
							time
						};
						blogs.push(blogData);
					}
				}
				resolve(blogs);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function getUserBlogList(userId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT BLOGS.ID as BLOG_ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.ID WHERE USERS.ID = ? ORDER BY POST_DATETIME DESC', [userId], function (error, results, fields) {
				if (error) throw error;
				const blogs = []
				if (results.length > 0) {
					for (const blog of results) {
						const { BLOG_ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME } = blog;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const blogData = {
							id: BLOG_ID,
							username: NAME,
							profilePicUrl: PROFILE_IMAGE_URL,
							title: TITLE,
							subTitle: SUBTITLE,
							keywords: KEYWORDS,
							date,
							time
						};
						blogs.push(blogData);
					}
				}
				resolve(blogs);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function getBlog(blogId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT * FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.ID WHERE BLOGS.ID = ?', [blogId], function (error, results, fields) {
				if (error) throw error;
				if (results.length > 0) {
					const { ID, EMAIL, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, CONTENT, POST_DATETIME } = results[0];
					const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
					const time = POST_DATETIME.toLocaleTimeString();
					const blogData = {
						id: ID,
						username: NAME,
						email: EMAIL,
						profilePicUrl: PROFILE_IMAGE_URL,
						title: TITLE,
						subTitle: SUBTITLE,
						keywords: KEYWORDS,
						content: CONTENT,
						date,
						time
					};
					resolve(blogData);
				}
				reject("404: Blog not found");
			});
		} catch (error) {
			reject(error);
		}
	});
}

function storeBlog(blogData) {
	return new Promise((resolve, reject) => {
		try {
			const { userId, title, subTitle, keywords, content } = blogData;
			const post = {
				'USER_ID': userId,
				'TITLE': title,
				'SUBTITLE': subTitle,
				'KEYWORDS': keywords,
				'CONTENT': content
			};
			connection.query('INSERT INTO BLOGS SET ?', post, function (error, results, fields) {
				if (error) throw error;
				resolve(results.insertId);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function editBlog(blogData) {
	return new Promise((resolve, reject) => {
		try {
			const { blogId, userId, title, subTitle, keywords, content } = blogData;
			const post = {
				'USER_ID': userId,
				'TITLE': title,
				'SUBTITLE': subTitle,
				'KEYWORDS': keywords,
				'CONTENT': content
			};
			connection.query('UPDATE BLOGS SET ? WHERE ID = ?', [post, blogId], function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function deleteBlog(blogId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('DELETE FROM BLOGS WHERE ID = ?', [blogId], function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

exports.getBlog = getBlog;
exports.getBlogList = getBlogList;
exports.storeBlog = storeBlog;
exports.editBlog = editBlog;
exports.getUserBlogList = getUserBlogList;
exports.deleteBlog = deleteBlog;