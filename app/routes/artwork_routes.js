import { Router } from 'express';
// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'
import Artwork from '../models/artwork';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404, handleError } from '../lib/custom_errors';

import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

const requireToken = authenticate('bearer', { session: false })

// RESTFUL

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
    handleError(err);
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
      artwork.save(handleError)
      return artwork
    }).then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() })
    }).catch(next)
});

// DELETE
router.delete('/artwork/:id', requireToken, (req, res, next) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(STATUS.NO_CONTENT).json()
    })
    .catch(next)
});

// NON-RESTFUL

// ADD TAG
router.post('/artwork/:id/galleries', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const { galleryId } = req.body;
      artwork.tags.push(galleryId);
      artwork.save(handleError)
      return artwork
    })
    .then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() });
    })
    .catch(next)
});

// REMOVE TAG
router.delete('/artwork/:id/galleries/:galleryId', requireToken, (req, res, next) => {
  Artwork.findById(req.params.id)
    .then(handle404)
    .then(artwork => {
      const { tagname } = req.params;
      if (artwork.tags.includes(tagname)) {
        const woTag = artwork.tags.filter(item => item !== tagname);
        artwork.tags = woTag;
        artwork.save(handleError);
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
      artwork.save(handleError);
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() });
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
      artwork.save(handleError);
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() });
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
        artwork.filters[filterKey] = null;
        artwork.save(handleError)
      }
      return artwork;
    })
    .then(artwork => {
      res.status(STATUS.OK).json();
    })
    .catch(next)
})

// NO TOKEN (for import; remove for production)

// CREATE FREE
router.post('/artwork-f', (req, res, next) => {
  Artwork.create(req.body.artwork, function (err, art) {
    handleError(err);
    return art;
  }).then(artwork => {
    res.status(STATUS.CREATED).json({ artwork: artwork.toObject() })
  }).catch(next);
});

// UPDATE FREE
router.patch('/artwork-f/:id', (req, res, next) => {
  Artwork.findByIdAndUpdate(req.params.id, req.body.artwork)
    .then(handle404)
    .then(artwork => {
      artwork.save(handleError)
      return artwork
    }).then(artwork => {
      res.status(STATUS.OK).json({ artwork: artwork.toObject() })
    }).catch(next)
})

// DELETE FREE
router.delete('/artwork-f/:id', (req, res, next) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then(handle404)
    .then(() => {
      res.status(STATUS.NO_CONTENT).json()
    })
    .catch(next)
});

export default router;
