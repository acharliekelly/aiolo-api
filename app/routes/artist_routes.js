// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport';

import { find, findById } from '../models/artist';

import { handle404, requireAdmin } from '../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();
const requireToken = authenticate('bearer', { session: false });

// INDEX
router.get('/artists', (req, res, next) => {
  find()
    .then(artist => {
      return artist.map(item => item.toObject());
    })
    .then(artist => res.status(STATUS.OK).json({ artist }))
    .catch(next)
});

// SHOW
router.get('/artists/:id', (req, res, next) => {
  findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ artist: item.toObject() }))
    .catch(next)
});

// CREATE
router.post('/artist', requireToken, (req, res, next) => {
  console.log(req.body.artist);
  req.body.artist.user = req.user.id;
  // TODO: complete
});

// UPDATE
// TODO: add route

// DESTROY
// TODO: add route

export default router;
