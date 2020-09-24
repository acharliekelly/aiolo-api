import { Router } from 'express';
import Artwork from '../models/artwork';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

// INDEX
router.get('/artwork', (req, res, next) => {
  Artwork.find()
    .then(artwork => {
      return artwork.map(item => item.toObject());
    })
    .then(artwork => res.status(STATUS.OK).json({ artwork }))
    .catch(next)
});

// SHOW
router.get('/artwork/:id', (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ artwork: item.toObject() }))
    .catch(next)
});

// CREATE

// UPDATE

// DELETE

export default router;
