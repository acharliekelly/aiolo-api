/* Fetch gallery lists from Cloudinary,
 * create corresponding Mongoose objects,
 * save to MongoDB.
 * (Theoretically a one-time process)
 */
const cloudApi = require('./cloudApi');
const relations = require('./relations');
const Gallery = require('../app/models/gallery');
const Artwork = require('../app/models/artwork');
const Photo = require('../app/models/photo');
// const Product = require('../app/models/product');
const allGalleriesData = require('../data/galleries.json');
const allArtworks = require('../data/artworks.json');
const allPhotos = require('../data/photos.json');

const upsertOptions = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true
};

const importGallery = tagName => {
  const galleryData = allGalleriesData[tagName];
  Gallery.findOneAndUpdate(
    { tag: tagName },
    galleryData,
    upsertOptions
  ).then(doc => {
    console.log(`Gallery ${tagName} created: ${doc._id}`);
    return doc;
  }).catch(err => console.error('Import failed!', err));
}

const importAllGalleries = () => {
  let count = 0;
  allGalleriesData.forEach(gal => {
    let g = importGallery(gal);
    if (g) count++;
  });
  console.log(`added ${count} galleries`)
}

const importArtwork = () => {
  allArtworks.forEach(artData => {
    const id = artData.cloud_id.split('/')[1]
    Artwork.findOneAndUpdate(
      { cloudId: id },
      {
        cloudId: id,
        cloudFolder: artData.cloud_id.split('/')[0],
        copyProtect: artData['copy-protect'],
        title: artData.caption,
        completed: Date.parse(artData.completed),
        medium: artData.medium,
        location: cloudApi.getLocation(artData),
        dimensions: cloudApi.getDimensions(artData.size),
        artist: cloudApi.getDefaultArtist()
      },
      upsertOptions)
      .then(doc => console.log(`added ${id}: ${doc._id}`))
      // .catch(err => console.error(`import failed for: ${id}`))
  })
}

// NOT FINISHED
const importPhotos = () => {
  allPhotos.forEach(photoData => {
    const id = photoData.public_id.split('/')[1];
    Photo.findOneAndUpdate({ cloudId: id }, {
      cloudId: id,
      title: photoData.caption
    }, upsertOptions)
  })
  // TODO: FINISH
}

const updateArtworkTags = tagName => {
  const artIds = cloudApi.fetchGallery(tagName)
    .then(resources => resources.map(resource =>
      resource.public_id.split('/')[1]))
    .catch(err => console.error(err));
  artIds.forEach(id => relations.addGalleryToArtwork(id, tagName))
}

module.exports = {
  importGallery,
  importAllGalleries,
  importArtwork,
  importPhotos,
  updateArtworkTags
};
