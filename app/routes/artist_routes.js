// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport';

import Artist from '../models/artist';

import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();
const requireToken = authenticate('bearer', { session: false });

// INDEX
router.get('/artists', (req, res, next) => {
  Artist.find()
    .then(artist => {
      return artist.map(item => item.toObject());
    })
    .then(artist => res.status(STATUS.OK).json({ artist }))
    .catch(next)
});

// SHOW
router.get('/artists/:id', (req, res, next) => {
  Artist.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ artist: item.toObject() }))
    .catch(next)
});

router.post('/artist', requireToken, (req, res, next) => {
  Artist.create(req.body.artist, function (err, artist) {
    if (err) console.log(err);
    return artist;
  }).then(artist => {
    return artist;
  }).then(artist => {
    res.status(STATUS.CREATED).json({ artist: artist.toObject() })
  }).catch(next);
});

// UPDATE
// TODO: add route

// DESTROY
// TODO: add route

// NO TOKEN (remove for production)
router.post('/artist-f', (req, res, next) => {
  Artist.create(req.body.artist, function (err, artist) {
    if (err) console.log(err);
    return artist;
  }).then(artist => {
    return artist;
  }).then(artist => {
    res.status(STATUS.CREATED).json({ artist: artist.toObject() })
  }).catch(next);
});

export default router;
