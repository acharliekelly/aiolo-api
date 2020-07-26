const express = require('express');
// const passport = require('passport');
const { fetchGallery } = require('../../lib/cloudApi');

const Gallery = require('../models/gallery');
// const Artwork = require('../models/artwork');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// use this to prevent anyone but admin from modifying products
// const requireAdmin = customErrors.requireAdmin

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
// const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.get('/galleries', (req, res, next) => {
  Gallery.find()
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(200).json({ galleries }))
    .catch(next)
});

router.get('/albums', (req, res, next) => {
  Gallery.find({ filter: 'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(200).json({ galleries }))
    .catch(next)
});

router.get('/filters', (req, res, next) => {
  Gallery.find({ filter: !'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(200).json({ galleries }))
    .catch(next)
});

router.get('/filters/:name', (req, res, next) => {
  Gallery.find({ filter: req.params.name })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(200).json({ galleries }))
    .catch(next)
});

router.get('/tag/:id', (req, res, next) => {
  Gallery.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(200).json({ tag: item.toObject() }))
    .catch(next)
});

router.get('/gallery/:tag', (req, res, next) => {
  const tagName = req.params.tag;
  fetchGallery(tagName)
    .then(resources => {
      return resources.map(resource => resource.toObject())
    })
    .then(resources => res.status(200).json({ resources }))
    .catch(next)
});
