const express = require('express');
const passport = require('passport');

const Artwork = require('../models/artwork');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// use this to prevent anyone but admin from modifying products
const requireAdmin = customErrors.requireAdmin

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// INDEX
router.get('/artwork', (req, res, next) => {
  Artwork.find()
    .then(artwork => {
      return artwork.map(item => item.toObject());
    })
    .then(artwork => res.status(200).json({ artwork }))
    .catch(next)
});

// SHOW
router.get('/artwork/:id', (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(200).json({ artwork: item.toObject() }))
    .catch(next)
});

// CREATE
router.post('/artwork', requireToken, removeBlanks, (req, res, next) => {
  requireAdmin(req);
  Artwork.create(req.body.artwork)
    .then(artwork => {
      res.status(201).json({ artwork: artwork.toObject() })
    })
    .catch(next)
});

// UPDATE
router.patch('/artwork/:id', requireToken, removeBlanks, (req, res, next) => {
  requireAdmin(req);
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => artwork.update(req.body.artwork))
    .then(() => res.sendStatus(204))
    .catch(next)
});

// DESTROY
router.delete('/artwork/:id', requireToken, (req, res, next) => {
  requireAdmin(res);
  Artwork.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next)
});

module.exports = router;
