import { Router } from 'express';
import ProgressList from '../models/progressList';

import { handle404 } from '../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();

// INDEX
router.get('/progress', (req, res, next) => {
  ProgressList.find()
    .then(progressList => {
      return progressList.map(item => item.toObject());
    })
    .then(progressList => res.status(STATUS.OK).json({ progressList }))
    .catch(next)
});

// SHOW
router.get('/progress/:id', (req, res, next) => {
  ProgressList.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ progressList: item.toObject() }))
    .catch(next)
});

export default router;
