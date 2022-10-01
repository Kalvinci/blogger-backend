require("dotenv").config();

const express = require("express");
const cors = require('cors');
const { getBlogList, getBlog, storeBlog } = require("./dbService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

app.get("/blogs/:blogId", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		const blogData = await getBlog(blogId);
		res.send(blogData);
	} catch (error) {
		console.log(error);
	}
});

app.get("/blogs", async (req, res) => {
	try {
		const blogs = await getBlogList();
		res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.post("/publish", async (req, res) => {
	try {
		const blogData = req.body;
		await storeBlog(blogData);
	} catch (error) {
		console.log(error);
	}
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
});