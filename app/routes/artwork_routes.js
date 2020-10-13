import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'
import Artwork from '../models/artwork';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

const requireToken = authenticate('bearer', { session: false })

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
router.post('/artwork', requireToken, (req, res, next) => {
  Artwork.create(req.body.artwork, function (err, art) {
    if (err) console.log(err);
    return art;
  }).then(artwork => {
    return artwork;
  }).then(artwork => {
    res.status(STATUS.CREATED).json({ artwork: artwork.toObject() })
  }).catch(next);
});

// UPDATE
router.patch('/artwork/:id', requireToken, (req, res, next) => {
  Artwork.findByIdAndUpdate(req.params.id, req.body.artwork)
    .then(handle404)
    .then(artwork => {
      artwork.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return artwork
    }).then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() })
    }).catch(next)
});

// ADD TAG
router.post('/artwork/:id/tags', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      artwork.tags.push(req.body.tagName)
      artwork.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return artwork
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
});

// REMOVE TAG
router.delete('/artwork/:id/tags/:tagname', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const removeTag = req.params.tagname;
      if (artwork.tags.includes(removeTag)) {
        const woTag = artwork.tags.filter(item => item !== removeTag);
        artwork.tags = woTag;
        artwork.save(function (err) {
          if (err) {
            console.log(err);
          }
        })
      }
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
});

// ADD FILTER
router.post('/artwork/:id/filters', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const { filterKey, filterValue } = req.body;
      artwork.filters[filterKey] = filterValue;
      artwork.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
})

// UPDATE FILTER
router.patch('/artwork/:id/filters/:filterKey', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const { filterKey } = req.params;
      const { filterValue } = req.body;
      artwork.filters[filterKey] = filterValue;
      artwork.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
})

// REMOVE FILTER
router.delete('/artwork/:id/filters/:filterKey', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const { filterKey } = req.params;
      if (artwork.filters[filterKey]) {
        artwork.filters[filterKey] = undefined;
        artwork.save(function (err) {
          if (err) {
            console.log(err);
          }
        })
      }
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
})

// DELETE
router.delete('/artwork/:id', requireToken, (req, res, next) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then(artwork => {
      res.status(204).json()
    })
    .catch(next)
});

// NO TOKEN (for import; remove for production)

// CREATE FREE
router.post('/artwork-f', (req, res, next) => {
  Artwork.create(req.body.artwork, function (err, art) {
    if (err) console.log(err);
    return art;
  }).then(artwork => {
    return artwork;
  }).then(artwork => {
    res.status(STATUS.CREATED).json({ artwork: artwork.toObject() })
  }).catch(next);
});

// UPDATE FREE
router.patch('/artwork-f/:id', (req, res, next) => {
  Artwork.findByIdAndUpdate(req.params.id, req.body.artwork)
    .then(handle404)
    .then(artwork => {
      artwork.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return artwork
    }).then(artwork => {
      res.status(STATUS.CREATED).json({ artwork: artwork.toObject() })
    }).catch(next)
})

// DELETE FREE
router.delete('/artwork-f/:id', (req, res, next) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then(handle404)
    .then(artwork => {
      res.status(204).json()
    })
    .catch(next)
});

export default router;
