const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

// GET /posts
router.get('/', postsController.index);

// GET /posts/:slug
router.get('/:slug', postsController.show);

// POST /posts
router.post('/', postsController.store);

// PUT /posts/:slug
router.put('/:slug', postsController.update);

// DELETE /posts/:slug
router.delete('/:slug', postsController.destroy);


module.exports = router;