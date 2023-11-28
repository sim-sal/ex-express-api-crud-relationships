const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const { body } = require('express-validator');

// GET /posts
router.get('/', postsController.index);

// GET /posts/:slug
router.get('/:slug', postsController.show);

// POST /posts
router.post('/',
    body("title").notEmpty(),
    body('image').optional(),
    body('content').isLength({ min: 5 }).withMessage('Il Contenuto deve essere minimo di 5 caratteri'),
    postsController.store);

// PUT /posts/:slug
router.put('/:slug', postsController.update);

// DELETE /posts/:slug
router.delete('/:slug', postsController.destroy);


module.exports = router;