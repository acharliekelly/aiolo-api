import { Router } from 'express';
import { authenticate } from 'passport';
import ProgressList from '../models/progressList';

import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();
const requireToken = authenticate('bearer', { session: false });

/**
 * INDEX
 */
router.get('/progress', (req, res, next) => {
  ProgressList.find()
    .then(progressList => {
      return progressList.map(item => item.toObject());
    })
    .then(progressList => res.status(STATUS.OK).json({ progressList }))
    .catch(next)
});

/**
 * SHOW
 */
router.get('/progress/:id', (req, res, next) => {
  ProgressList.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ progressList: item.toObject() }))
    .catch(next)
});

/**
 * CREATE
 */
router.post('/progress', requireToken, (req, res, next) => {
  const { artworkId, images } = req.body;
  ProgressList.create({ artworkId, images }, function (err, progress) {
    if (err) console.log(err);
    return progress;
  }).then(progressList => {
    return progressList;
  }).then(progressList => {
    res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
  }).catch(next);
});

/**
* UPDATE
*/
router.patch('/progress/:id', requireToken, (req, res, next) => {
  const { artworkId, images } = req.body;
  ProgressList.findByIdAndUpdate(req.params.id, { artworkId, images })
    .then(handle404)
    .then(progressList => {
      return progressList;
    }).then(progressList => {
      res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
    }).catch(next)
});

/**
 * ADD IMAGE
 * add one image to progress list
 * takes image._id, not publicId
 */
router.get('/add-progress/:progressId/:imageId', requireToken, (req, res, next) => {
  const { progressId, imageId } = req.params;
  ProgressList.findById(progressId)
    .then(progressObj => {
      progressObj.images.push(imageId);
      progressObj.save(function (err, prog) {
        if (err) console.log(err);
        return prog;
      })
    }).then(progressList => {
      res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
    }).catch(next)
});

/**
 * DELETE
 */
router.delete('/progress/:id', requireToken, (req, res, next) => {
  ProgressList.findByIdAndDelete(req.params.id)
    .then(res.status(STATUS.NO_CONTENT).json())
    .catch(next)
});

/**
 * NO TOKEN
 */
/**
 * CREATE
 */
router.post('/progress-f', (req, res, next) => {
  const { artworkId, images } = req.body;
  ProgressList.create({ artworkId, images }, function (err, progress) {
    if (err) console.log(err);
    return progress;
  }).then(progressList => {
    return progressList;
  }).then(progressList => {
    res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
  }).catch(next);
});

/**
* UPDATE
*/
router.patch('/progress-f/:id', (req, res, next) => {
  const { artworkId, images } = req.body;
  ProgressList.findByIdAndUpdate(req.params.id, { artworkId, images })
    .then(handle404)
    .then(progressList => {
      return progressList;
    }).then(progressList => {
      res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
    }).catch(next)
});

/**
 * ADD IMAGE
 * add one image to progress list
 * takes image._id, not publicId
 */
router.get('/add-progress-f/:progressId/:imageId', (req, res, next) => {
  const { progressId, imageId } = req.params;
  ProgressList.findById(progressId)
    .then(progressObj => {
      progressObj.images.push(imageId);
      progressObj.save(function (err, prog) {
        if (err) console.log(err);
        return prog;
      })
    }).then(progressList => {
      res.status(STATUS.CREATED).json({ progressList: progressList.toObject() })
    }).catch(next)
});

/**
 * DELETE
 */
router.delete('/progress-f/:id', (req, res, next) => {
  ProgressList.findByIdAndDelete(req.params.id)
    .then(res.status(STATUS.NO_CONTENT).json())
    .catch(next)
});

export default router;
