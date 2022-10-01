const mysql = require('mysql');

const connection = mysql.createConnection({
	host: process.env.DB_URL,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

function getBlogList() {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT ID, PROFILE_IMAGE_URL, USERNAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME FROM BLOGS', function (error, results, fields) {
				if (error) throw error;
				const blogs = []
				if (results.length > 0) {
					for (const blog of results) {
						const { ID, PROFILE_IMAGE_URL, USERNAME, TITLE, SUBTITLE, KEYWORDS, POST_DATETIME } = blog;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const blogData = {
							id: ID,
							username: USERNAME,
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
			connection.query('SELECT * FROM BLOGS WHERE ID = ?', [blogId], function (error, results, fields) {
				if (error) throw error;
				if (results.length > 0) {
					const { ID, EMAIL, PROFILE_IMAGE_URL, USERNAME, TITLE, SUBTITLE, KEYWORDS, CONTENT, POST_DATETIME } = results[0];
					const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
					const time = POST_DATETIME.toLocaleTimeString();
					const blogData = {
						id: ID,
						username: USERNAME,
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
			const { username, email, profilePicUrl, title, subTitle, keywords, content } = blogData;
			const post = {
				'USERNAME': username,
				'EMAIL': email,
				'PROFILE_IMAGE_URL': profilePicUrl,
				'TITLE': title,
				'SUBTITLE': subTitle,
				'KEYWORDS': keywords,
				'CONTENT': content
			};
			connection.query('INSERT INTO BLOGS SET ?', post, function (error, results, fields) {
				if (error) throw error;
				resolve();
			});
		} catch (error) {
			reject(error);
		}
	});
}

exports.getBlog = getBlog;
exports.getBlogList = getBlogList;
exports.storeBlog = storeBlog;