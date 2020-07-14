// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for examples
const Product = require('../models/product')

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
const router = express.Router()

// INDEX
// GET /products
router.get('/products', (req, res, next) => {
  Product.find()
    .then(products => {
      // `products will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return products.map(product => product.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(products => res.status(200).json({ products }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /products/:id
router.get('/products/:id', (req, res, next) => {
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => res.status(200).json({ product: product.toObject() }))
    .catch(next)
})

// CREATE
// POST /products
router.post('/products', requireToken, removeBlanks, (req, res, next) => {
  requireAdmin(req)
  Product.create(req.body.product)
    .then(product => {
      res.status(201).json({ product: product.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /products/:id
router.patch('/products/:id', requireToken, removeBlanks, (req, res, next) => {
  requireAdmin(req)
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => product.update(req.body.product))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /products:id
router.delete('/products/:id', requireToken, (req, res, next) => {
  requireAdmin(req)
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
