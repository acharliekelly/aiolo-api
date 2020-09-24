import { Router } from 'express';
import { fetchGallery } from '../lib/cloudApi';

import Gallery from '../models/gallery';

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

// instantiate a router (mini app that only handles routes)
const router = Router();

router.get('/galleries', (req, res, next) => {
  Gallery.find()
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

router.get('/albums', (req, res, next) => {
  Gallery.find({ filter: 'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

router.get('/filters', (req, res, next) => {
  Gallery.find({ filter: !'album' })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

router.get('/filters/:name', (req, res, next) => {
  Gallery.find({ filter: req.params.name })
    .then(galleries => {
      return galleries.map(gallery => gallery.toObject())
    })
    .then(galleries => res.status(STATUS.OK).json({ galleries }))
    .catch(next)
});

router.get('/tag/:id', (req, res, next) => {
  Gallery.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ tag: item.toObject() }))
    .catch(next)
});

/**
 * Returns <tag>.json from Cloudinary
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
