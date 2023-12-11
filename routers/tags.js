const { Router } = require('express');
const router = Router();
const tagsController = require("../controllers/tags");


router.get("/", tagsController.index)

// POST /tags
router.post("/", tagsController.store)

module.exports = router;