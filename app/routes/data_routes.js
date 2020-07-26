// TEMPORARILY UNSECURE
const express = require('express');

const router = express.Router();

const importApi = require('../../lib/importApi');

// import a gallery
router.put('/import/gallery/:tag', (req, res, next) => {
  const tagName = req.params.tag;
  importApi.importGallery(tagName);
});

// import all galleries not already 
router.put('/import/galleries', (req, res, next) => {
  importApi.importAllGalleries();
});

router.put('/import/artwork', (req, res, next) => {
  importApi.importArtwork();
});

router.put('/import/photos', (req, res, next) => {
  importApi.importPhotos();
});

router.put('/update/tags', (req, res, next) => {
  const tagName = req.params.tag;
  importApi.updateArtworkTags(tagName);
});
