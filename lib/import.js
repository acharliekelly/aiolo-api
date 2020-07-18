/* Fetch gallery lists from Cloudinary,
 * create corresponding Mongoose objects,
 * save to MongoDB.
 * (Theoretically a one-time process)
 */
const cloudName = 'cantimaginewhy';
const cloudApi = require('./cloudApi');
const Gallery = require('../app/models/gallery');

const importGalleries = json => {
  json.forEach(gal => {
    Gallery.create(gal)
      .then(gallery => console.log(`Created ${gallery.name} gallery`))
  })
}
const importArtwork = galleryTag => {
  cloudApi.fetchGallery(cloudName, galleryTag)
    .then(resources => resources.map(resource => {
      cloudApi.cloudinaryToArtwork(resource, galleryTag)
        .then(item => console.log(`Created item "${item.title}"`))
        .catch(err => console.error(err))
    }))
    .catch(err => console.error(err))
}

const importPhotos = () => {
  cloudApi.fetchGallery('onsite')
    .then(photos => photos.map(photo => {
      cloudApi.cloudinaryToPhoto(photo)
        .then(item => console.log(`Created photo ${item.cloudId}`))
        .catch(err => console.error(err))
    }))
    .catch(err => console.error(err));
}

module.exports = {
  importGalleries,
  importArtwork,
  importPhotos
};
