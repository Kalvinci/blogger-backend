const express = require("express");
const path = require("path");

const {
	getBlogList,
	getBlog,
	storeBlog,
	editBlog,
	deleteBlog,
	getUserBlogList
} = require("./src/blogService");

const {
	getComments,
	storeComment,
	editComment,
	deleteComment
} = require("./src/commentService");

const {
	createUser,
	getUser
} = require("./src/userService");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "build")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});

app.get("/blogs", async (req, res) => {
	try {
		const blogs = await getBlogList();
		return res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.get("/blogs/:blogId", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		const blogData = await getBlog(blogId);
		return res.send(blogData);
	} catch (error) {
		console.log(error);
	}
});

app.post("/blogs", async (req, res) => {
	try {
		const blogData = req.body;
		const blogId = await storeBlog(blogData);
		return res.send({ blogId });
	} catch (error) {
		console.log(error);
	}
});

app.patch("/blogs", async (req, res) => {
	try {
		const blogData = req.body;
		await editBlog(blogData);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.delete("/blogs/:blogId", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		console.log(req.body);
		await deleteBlog(blogId);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.get("/blogs/:blogId/comments", async (req, res) => {
	try {
		const blogId = req.params.blogId;
		const blogs = await getComments(blogId);
		return res.send(blogs);
	} catch (error) {
		console.log(error);
	}
});

app.post("/blogs/:blogId/comments", async (req, res) => {
	try {
		const commentData = req.body;
		await storeComment(commentData);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.patch("/blogs/:blogId/comments", async (req, res) => {
	try {
		const commentData = req.body;
		await editComment(commentData);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.delete("/blogs/:blogId/comments/:commentId", async (req, res) => {
	try {
		const commentId = req.params.commentId;
		await deleteComment(commentId);
		return res.send();
	} catch (error) {
		console.log(error);
	}
});

app.get("/users/:userId/blogs", async (req, res) => {
	try {
		const userId = req.params.userId;
		const blogs = await getUserBlogList(userId);
		return res.send(blogs);
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