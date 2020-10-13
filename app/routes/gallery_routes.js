import { Router } from 'express';

// Passport docs: http://www.passportjs.org/docs/
import { authenticate } from 'passport'
import { fetchGallery } from '../lib/cloudApi';

import Gallery from '../models/gallery';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// const requireToken = authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = Router();

const requireToken = authenticate('bearer', { session: false });

/**
 * INDEX
 * GET /galleries
 * all galleries
 */
router.get('/galleries', (req, res, next) => {
  Gallery.find()
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

/**
 * GET /albums
 * only Album galleries
 */
router.get('/albums', (req, res, next) => {
  Gallery.find({ filter: 'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

/**
 * GET /filters
 * non-Album galleries
 */
router.get('/filters', (req, res, next) => {
  Gallery.find({ filter: !'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

/**
 * GET /filters/:name
 * named filter
 */
router.get('/filters/:name', (req, res, next) => {
  Gallery.findOne({ filter: req.params.name })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

/**
 * SHOW
 * GET /galleries/:id
 * gallery by Id
 */
router.get('/galleries/:id', (req, res, next) => {
  Gallery.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ tag: item.toObject() }))
    .catch(next)
});

/**
 * GET /gallery/:tag
 * Returns <tag>.json from Cloudinary
 * (list of artwork from gallery, on old system - use for import only)
 */
router.get('/gallery/:tag', (req, res, next) => {
  const tagName = req.params.tag;
  fetchGallery(tagName)
    .then(resources => {
      return resources.map(resource => resource.toObject())
    })
    .then(resources => res.status(STATUS.OK).json({ resources }))
    .catch(next)
});

/**
 * POST /gallery
 * create gallery
 */
router.post('/galleries', requireToken, (req, res, next) => {
  console.log(req.body.gallery);
  Gallery.create(req.body.gallery, function (err, gallery) {
    if (err) console.log(err);
    return gallery;
  }).then(gallery => {
    return gallery;
  }).then(gallery => {
    res.status(STATUS.CREATED).json({ gallery: gallery.toObject() })
  }).catch(next);
});

/**
 * PATCH /gallery/:id
 * update gallery
 */
router.patch('/galleries/:id', requireToken, (req, res, next) => {
  Gallery.findByIdAndUpdate(req.params.id, req.body.gallery)
    .then(handle404)
    .then(gallery => {
      gallery.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return gallery;
    }).then(gallery => {
      res.status(STATUS.CREATED).json({ gallery: gallery.toObject() })
    }).catch(next);
});

/**
 * DESTROY /gallery/:id
 * delete gallery
 */
router.delete('/galleries/:id', requireToken, (req, res, next) => {
  Gallery.findByIdAndDelete(req.params.id)
    .then(gallery => {
      res.status(204).json()
    })
});

/**
 * NO TOKEN
 * remove for production
 */
/**
 * POST /gallery
 * create gallery
 */
router.post('/galleries-f', (req, res, next) => {
  console.log(req.body.gallery);
  Gallery.create(req.body.gallery, function (err, gallery) {
    if (err) console.log(err);
    return gallery;
  }).then(gallery => {
    return gallery;
  }).then(gallery => {
    res.status(STATUS.CREATED).json({ gallery: gallery.toObject() })
  }).catch(next);
});

/**
 * PATCH /gallery/:id
 * update gallery
 */
router.patch('/galleries-f/:id', (req, res, next) => {
  Gallery.findByIdAndUpdate(req.params.id, req.body.gallery)
    .then(handle404)
    .then(gallery => {
      gallery.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
      return gallery;
    }).then(gallery => {
      res.status(STATUS.CREATED).json({ gallery: gallery.toObject() })
    }).catch(next);
});

/**
 * DESTROY /gallery/:id
 * delete gallery
 */
router.delete('/galleries-f/:id', (req, res, next) => {
  Gallery.findByIdAndDelete(req.params.id)
    .then(gallery => {
      res.status(204).json()
    })
});
