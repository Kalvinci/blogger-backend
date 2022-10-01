const { S3 } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

const ImageType = {
	PROFILE: "PROFILE",
	BLOG: "BLOG"
}

const s3Client = new S3({ region: process.env.AWS_REGION });

const upload = multer({
	storage: multerS3({
		s3: s3Client,
		bucket: process.env.AWS_BUCKET_NAME,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			console.log(file);
			cb(null, Date.now().toString());
		}
	})
});


// async function uploadImage(type) {
// 	try {
// 		const fd = await open("./img.jpg", "r");
// 		let key = (type == ImageType.PROFILE ? "profile_images/" : "blog_images/") + imgName;
// 		const params = {
// 			Bucket: process.env.AWS_BUCKET_NAME,
// 			Key: key,
// 			Body: fd.createReadStream()
// 		};
// 		const client = new S3({ region: process.env.AWS_REGION });
// 		const results = await client.send(new PutObjectCommand(params));
// 		return results;
// 	} catch (error) {
// 		console.log("Error", error);
// 	}
// };

// exports.ImageType = ImageType;
exports.upload = upload;