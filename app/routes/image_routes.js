import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'
import Image from '../models/image';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

const requireToken = authenticate('bearer', { session: false });

// INDEX
router.get('/images', (req, res, next) => {
  Image.find()
    .then(image => {
      return image.map(item => item.toObject());
    })
    .then(image => res.status(STATUS.OK).json({ image }))
    .catch(next)
});

// SHOW
router.get('/images/:id', (req, res, next) => {
  Image.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ image: item.toObject() }))
    .catch(next)
});

// LOOKUP
router.get('/imageLookup/:publicId', (req, res, next) => {
  Image.findOne({ 'publicId': req.params.publicId })
    .then(handle404)
    .then(image => res.status(STATUS.OK).json({ image: image.toObject() }))
    .catch(next)
});

// CREATE
router.post('/images', requireToken, (req, res, next) => {
  Image.create(req.body.image, (err, img) => {
    if (err) console.log(err)
    return img;
  }).then(image => {
    return image;
  }).then(image => {
    res.status(STATUS.CREATED).json({ image: image.toObject() })
  }).catch(next);
})

// UPDATE
router.patch('/images/:id', requireToken, (req, res, next) => {
  Image.findByIdAndUpdate(req.params.id, req.body.image)
    .then(handle404)
    .then(image => {
      image.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return image
    }).then(image => {
      res.status(STATUS.CREATED).json({ image: image.toObject() })
    }).catch(next)
})

// DELETE
router.delete('/images/:id', requireToken, (req, res, next) => {
  Image.findByIdAndDelete(req.params.id)
    .then(handle404)
    .then(artwork => {
      res.status(204).json()
    })
});

/**
 * NO TOKEN
 * remove for production
 */

// CREATE
router.post('/images-f', (req, res, next) => {
  Image.create(req.body.image, (err, img) => {
    if (err) console.log(err)
    return img;
  }).then(image => {
    return image;
  }).then(image => {
    res.status(STATUS.CREATED).json({ image: image.toObject() })
  }).catch(next);
})

// UPDATE
router.patch('/images-f/:id', (req, res, next) => {
  Image.findByIdAndUpdate(req.params.id, req.body.image)
    .then(handle404)
    .then(image => {
      image.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return image
    }).then(image => {
      res.status(STATUS.CREATED).json({ image: image.toObject() })
    }).catch(next)
})

// DELETE
router.delete('/images-f/:id', (req, res, next) => {
  Image.findByIdAndDelete(req.params.id)
    .then(handle404)
    .then(artwork => {
      res.status(204).json()
    })
});

export default router;
