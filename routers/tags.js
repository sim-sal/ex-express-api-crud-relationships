const { Router } = require('express');
const router = Router();
const tagsController = require("../controllers/tags");

// POST /tags
router.post("/", tagsController.store)

module.exports = router;