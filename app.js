const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routers/posts");
const categoriesRouter = require("./routers/categories");
const tagsRouter = require("./routers/tags");

const cors = require('cors');
const app = express();
const port = 3000;

dotenv.config();

// Abilita CORS per tutte le route
app.use(cors());
// application/json
app.use(express.json());

// ROUTERS
// posts
app.use("/posts", postsRouter);
// categories
app.use("/categories", categoriesRouter);
// tags
app.use("/tags", tagsRouter);

app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
})