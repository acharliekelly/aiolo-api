const axios = require('axios');
// const cloudinary = require('cloudinary');

const Artwork = require('../app/models/artwork');
const CloudinaryResource = require('../app/models/cloudinaryResource');

const fetchGallery = (cloudName, tagName) => {
  const url = `https://res.cloudinary.com/${cloudName}/image/list/${tagName}.json`;
  return axios(url).then(res => res.data.resources);
};

/**
 * Takes cloudinary-format JSON object,
 * returns Artwork
 * @param {JSON} resource 
 */
const convertCloudinaryToArtwork = resource => {
  findArtwork(resource)
  Artwork.create({
    cloudId: resource.public_id,
    title: resource.context.custom.caption,
    description: resource.context.custom.alt,
    medium: resource.context.custom.medium,
    sizeWidth: parseInt(resource.context.custom.size.split('x')[0]),
    sizeHeight: parseInt(resource.context.custom.size.split('x')[1])
  })
};

const findArtwork = resource => {
  Artwork.find({ cloudId: resource.public_id })
    .then(artwork => {
      return artwork
    })
    // TODO: what if not found
};

module.exports = {
  fetchGallery,
  convertCloudinaryToArtwork
}
