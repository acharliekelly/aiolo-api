const db = require('../app/models');

const addOriginalProduct = function (artworkId, price) {
  return db.Product.create({
    name: 'Original Artwork',
    price,
    artwork: artworkId
  });
};

const addGalleryToArtwork = function (artworkId, gallery) {
  return db.Artwork.findByIdAndUpdate(
    artworkId,
    { $push: { gallery: gallery._id } },
    { new: true, useFindAndModify: false }
  );
};

const addArtworkToGallery = function (galleryId, artwork) {
  return db.findByIdAndUpdate(
    galleryId,
    { $push: { artwork: artwork._id } },
    { new: true, useFindAndModify: false }
  );
};

module.exports = {
  addOriginalProduct,
  addGalleryToArtwork,
  addArtworkToGallery
};
