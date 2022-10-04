const { connection } = require("./dbService");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 2;

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

exports.createUser = createUser;
exports.getUser = getUser;