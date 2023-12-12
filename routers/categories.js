const { Router } = require('express');
const router = Router();
const categoriesController = require("../controllers/categories");

router.get("/", categoriesController.index)

// POST /categories
router.post("/", categoriesController.store)

module.exports = router;