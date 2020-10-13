/* 
 * import data from local JSON files
 */

import Gallery from '../models/gallery';
import ProgressList from '../models/progressList';
import Image from '../models/image';

import { cloudinaryToImage } from './cloud';
import { getOnsiteRef } from './utils';

import allGalleries from '../../data/galleries.json';
import progressImages from '../../data/onsite.json';

const upsertOptions = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true
};

/**
 * create new Gallery object from data file
 * @param {String} tagName 
 */
const importGallery = tagName => {
  const galleryData = allGalleries[tagName];
  Gallery.findOneAndUpdate(
    { tag: tagName },
    galleryData,
    upsertOptions
  ).then(doc => {
    console.log(`Gallery ${tagName} created: ${doc._id}`);
    return doc;
  }).catch(err => console.error(`Import for ${tagName} failed!`, err));
}

export const updateGalleryCovers = () => {
  // enter coverImage ids
  Gallery.find()
    .then(galleries => galleries.map(gallery => {
      const thumbId = gallery.thumbnail;
      const img = Image.findOne({ publicId: thumbId });
      gallery.coverImage = img._id;
      gallery.save();
    }))
    .catch(err => console.error('update failed', err))
}

/**
 * create all Gallery objects from data file
 */
export const importAllGalleries = () => {
  let count = 0;
  allGalleries.forEach(gal => {
    let g = importGallery(gal);
    if (g) count++;
  });
  console.log(`added ${count} galleries`)
}

export const importProgressImages = async () => {
  progressImages.resources.forEach(resource => {
    try {
      const image = cloudinaryToImage(resource);
      const photoId = image.publicId;
      const artworkId = getOnsiteRef(photoId);
      let prog = ProgressList.findOne({ artworkId });
      if (!prog) prog = ProgressList.create({ artworkId });
      if (!prog.images.includes(image._id)) {
        prog.images.push(image._id);
        prog.save();
      }
    } catch (err) {
      console.error(err);
    }
  });
};
