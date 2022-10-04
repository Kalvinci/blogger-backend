const { connection } = require("./dbService");

function getComments(blogId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('SELECT COMMENTS.ID as COMMENT_ID, USER_ID, NAME, PROFILE_IMAGE_URL, CONTENT, POST_DATETIME FROM COMMENTS LEFT JOIN USERS ON COMMENTS.USER_ID = USERS.ID WHERE BLOG_ID = ? ORDER BY POST_DATETIME DESC', [blogId], function (error, results, fields) {
				if (error) throw error;
				const comments = []
				if (results.length > 0) {
					for (const comment of results) {
						const { COMMENT_ID, USER_ID, NAME, PROFILE_IMAGE_URL, CONTENT, POST_DATETIME } = comment;
						const date = POST_DATETIME.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
						const time = POST_DATETIME.toLocaleTimeString();
						const postDateTime = `${date} ${time}`;
						const commentData = {
							id: COMMENT_ID,
							userId: USER_ID,
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
			const { userId, blogId, content } = commentData;
			const post = {
				'USER_ID': userId,
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

function editComment(commentData) {
	return new Promise((resolve, reject) => {
		try {
			const { commentId, content } = commentData;
			connection.query('UPDATE COMMENTS SET CONTENT = ? WHERE ID = ?', [content, commentId], function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function deleteComment(commentId) {
	return new Promise((resolve, reject) => {
		try {
			connection.query('DELETE FROM COMMENTS WHERE ID = ?', [commentId], function (error, results, fields) {
				if (error) throw error;
				resolve(true);
			});
		} catch (error) {
			reject(error);
		}
	});
}

exports.getComments = getComments;
exports.storeComment = storeComment;
exports.editComment = editComment;
exports.deleteComment = deleteComment;