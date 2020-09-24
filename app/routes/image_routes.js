import { Router } from 'express';
import Image from '../models/image';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

// INDEX
router.get('/image', (req, res, next) => {
  Image.find()
    .then(image => {
      return image.map(item => item.toObject());
    })
    .then(image => res.status(STATUS.OK).json({ image }))
    .catch(next)
});

// SHOW
router.get('/image/:id', (req, res, next) => {
  Image.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ image: item.toObject() }))
    .catch(next)
});

export default router;
