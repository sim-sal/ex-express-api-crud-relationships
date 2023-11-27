const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routers/posts");
const categoriesRouter = require("./routers/categories");


const app = express();
const port = 3000;

dotenv.config();

// application/json
app.use(express.json());

// ROUTERS
// posts
app.use("/posts", postsRouter);
// categories
app.use("/categories", categoriesRouter);

app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
})