// Express docs: http://expressjs.com/en/api.html
import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport';

import Artist from '../models/artist';

import { handle404, handleError } from '../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();
const requireToken = authenticate('bearer', { session: false });

// INDEX
router.get('/artists', (req, res, next) => {
  Artist.find()
    .then(artists => {
      return artists.map(item => item.toObject());
    })
    .then(artists => res.status(STATUS.OK).json({ artists }))
    .catch(next)
});

// SHOW
router.get('/artists/:id', (req, res, next) => {
  Artist.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ artist: item.toObject() }))
    .catch(next)
});

router.post('/artists', requireToken, (req, res, next) => {
  Artist.create(req.body.artist, function (err, artist) {
    handleError(err);
    return artist;
  }).then(artist => {
    res.status(STATUS.CREATED).json({ artist: artist.toObject() })
  }).catch(next);
});

// UPDATE
router.patch('/artists/:id', requireToken, (req, res, next) => {
  Artist.findByIdAndUpdate(req.params.id, req.body.artist, function (err, artist) {
    handleError(err);
    return artist
  }).then(artist => {
    res.status(STATUS.OK).json({ artist: artist.toObject() })
  }).catch(next)
});

// DESTROY
router.delete('/artists/:id', requireToken, (req, res, next) => {
  Artist.findByIdAndDelete(req.params.id)
    .then(() => res.status(STATUS.NO_CONTENT).json())
    .catch(next)
})

// NO TOKEN (remove for production)
router.post('/artists-f', (req, res, next) => {
  Artist.create(req.body.artist, function (err, artist) {
    handleError(err);
    return artist;
  }).then(artist => {
    res.status(STATUS.CREATED).json({ artist: artist.toObject() })
  }).catch(next);
});

export default router;
