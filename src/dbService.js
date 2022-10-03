const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

const SALT_ROUNDS = 2;

function getBlogList() {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT * FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.EMAIL ORDER BY POST_DATETIME DESC', function (error, results, fields) {
				if (error) throw error;
				const blogs = []
				if (results.length > 0) {
					for (const blog of results) {
						const { ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME } = blog;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const blogData = {
							id: ID,
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
			connection.query('SELECT * FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.EMAIL WHERE USERS.EMAIL = ? ORDER BY POST_DATETIME DESC', [userId], function (error, results, fields) {
				if (error) throw error;
				const blogs = []
				if (results.length > 0) {
					for (const blog of results) {
						const { ID, PROFILE_IMAGE_URL, NAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME } = blog;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const blogData = {
							id: ID,
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
			connection.query('SELECT * FROM BLOGS INNER JOIN USERS ON BLOGS.USER_ID = USERS.EMAIL WHERE ID = ?', [blogId], function (error, results, fields) {
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
			const { email, title, subTitle, keywords, content } = blogData;
			const post = {
				'USER_ID': email,
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
			const { id, email, title, subTitle, keywords, content } = blogData;
			const post = {
				'USER_ID': email,
				'TITLE': title,
				'SUBTITLE': subTitle,
				'KEYWORDS': keywords,
				'CONTENT': content
			};
			connection.query('UPDATE BLOGS SET ? WHERE ID = ?', [post, id], function (error, results, fields) {
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

function getComments(blogId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT * FROM COMMENTS LEFT JOIN USERS ON COMMENTS.USER_ID = USERS.EMAIL WHERE BLOG_ID = ? ORDER BY POST_DATETIME DESC', [blogId], function (error, results, fields) {
				if (error) throw error;
				const comments = []
				if (results.length > 0) {
					for (const comment of results) {
						const { ID, NAME, PROFILE_IMAGE_URL, CONTENT, POST_DATETIME } = comment;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const postDateTime = `${date} ${time}`;
						const commentData = {
							id: ID,
							username: NAME,
							profilePicUrl: PROFILE_IMAGE_URL,
							content: CONTENT,
							dateTime: postDateTime
						};
						comments.push(commentData);
					}
				}
				resolve(comments);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function storeComment(commentData) {
	return new Promise((resolve, reject) => {
		try {
			const { email, blogId, content } = commentData;
			const post = {
				'USER_ID': email,
				'CONTENT': content,
				'BLOG_ID': blogId
			};
			connection.query('INSERT INTO COMMENTS SET ?', post, function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function createUser(userData) {
	return new Promise((resolve, reject) => {
		try {
			const { name, profilePicUrl, email, password } = userData;
			passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
			const post = {
				'NAME': name,
				'PROFILE_IMAGE_URL': profilePicUrl,
				'EMAIL': email,
				'PASSWORD': passwordHash
			};
			connection.query('INSERT INTO USERS SET ?', post, function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function getUser(data) {
	return new Promise((resolve, reject) => {
		try {
			const { email, password } = data;
			connection.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], function (error, results, fields) {
				if (error) throw error;
				if (results.length > 0) {
					const { ID, NAME, EMAIL, PROFILE_IMAGE_URL, PASSWORD } = results[0];
					if (bcrypt.compareSync(password, PASSWORD)) {
						const userData = {
							id: ID,
							name: NAME,
							email: EMAIL,
							profilePicUrl: PROFILE_IMAGE_URL
						};
						resolve(userData);
					} else {
						reject("Invalid password");
					}
				} else {
					reject("Invalid email")
				}
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
exports.getComments = getComments;
exports.storeComment = storeComment;
exports.createUser = createUser;
exports.getUser = getUser;
exports.getUserBlogList = getUserBlogList;
exports.deleteBlog = deleteBlog;