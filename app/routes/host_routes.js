import { Router } from 'express';
import { find, findById } from '../models/imageHost';

import { handle404 } from '../../lib/custom_errors';
import * as STATUS from './route_constants';

const router = Router();

// INDEX
router.get('/hosts', (req, res, next) => {
  find()
    .then(host => {
      return host.map(item => item.toObject());
    })
    .then(host => res.status(STATUS.OK).json({ host }))
    .catch(next)
});

// SHOW
router.get('/hosts/:id', (req, res, next) => {
  findById(req.params.id)
    .then(handle404)
    .then(item => res.status(STATUS.OK).json({ host: item.toObject() }))
    .catch(next)
});

export default router;
