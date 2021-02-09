// implement your posts router here
const Post = require('./posts-model');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'The posts information could not be retrieved' });
    });
});

router.get('/:id', (req, res) => {
  const targetId = req.params.id;
  Post.findById(targetId)
    .then((post) => {
      post
        ? res.status(200).json(post)
        : res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist' });
    })
    .catch(() =>
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved' }),
    );
});

router.post('/', (req, res) => {
  const newpost = req.body;

  if (!newpost.title || !newpost.contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for the post' });
  } else {
    Post.insert(newpost)
      .then(({ id }) => {
        Post.findById(id).then((post) => res.status(201).json(post));
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: 'The post information could not be retrieved' });
      });
  }
});

router.put('/:id', (req, res) => {
  const targetId = req.params.id;
  const changes = req.body;

  try {
    if (!changes.title || !changes.contents) {
      res
        .status(400)
        .json({ message: 'Please provide title and contents for the post' });
    } else {
      Post.update(targetId, changes).then((id) => {
        id
          ? Post.findById(targetId).then((post) => res.status(200).json(post))
          : res.status(404).json({
              message: 'The post with the specified ID does not exist',
            });
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: 'The post information could not be modified' });
  }
});

router.delete('/:id', (req, res) => {
  const targetId = req.params.id;

  try {
    Post.remove(targetId).then((i) => {
      i
        ? res.status(200).json({ message: 'The post was successfully deleted' })
        : res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist' });
    });
  } catch (e) {
    res.status(500).json({ message: 'The post could not be removed' });
  }
});

router.get('/:id/comments', (req, res) => {
  const targetId = req.params.id;
  Post.findPostComments(targetId)
    .then((comments) => {
      comments
        ? res.status(200).json(comments)
        : res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist' });
    })
    .catch(() =>
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved' }),
    );
});

module.exports = router;
