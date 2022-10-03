const express = require("express");
const {
	getBlogList,
	getBlog,
	storeBlog,
	editBlog,
	deleteBlog,
	getComments,
	storeComment,
	createUser,
	getUser,
	getUserBlogList
} = require("./dbService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/blogs/:blogId", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		const blogData = await getBlog(blogId);
		return res.send(blogData);
	} catch (error) {
		console.log(error);
	}
});

app.get("/blogs", async (req, res) => {
	try {
		const blogs = await getBlogList();
		return res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.get("/userblogs/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		const blogs = await getUserBlogList(userId);
		return res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.get("/comments/:blogId", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		const blogs = await getComments(blogId);
		return res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.post("/comment", async (req, res) => {
	try {
		const commentData = req.body;
		await storeComment(commentData);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.post("/publish", async (req, res) => {
	try {
		const blogData = req.body;
		const blogId = await storeBlog(blogData);
		return res.send({ blogId });
	} catch (error) {
		console.log(error);
	}
});

app.post("/edit", async (req, res) => {
	try {
		const blogData = req.body;
		await editBlog(blogData);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.post("/delete", async (req, res) => {
	try {
		const { blogId } = req.body;
		await deleteBlog(blogId);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});


app.post("/login", async (req, res) => {
	try {
		const data = req.body;
		const userData = await getUser(data);
		return res.send(userData);
	} catch (error) {
		console.log(error);
	}
});

app.post("/signup", async (req, res) => {
	try {
		const data = req.body;
		await createUser(data);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
});