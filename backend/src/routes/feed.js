const router = require('express').Router();
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts);

router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get('/post/:id', isAuth, feedController.getPost);

router.put(
  '/post/:id',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete('/post/:id', isAuth, feedController.deletePost);

module.exports = router;
