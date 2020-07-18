const axios = require('axios');
// const cloudinary = require('cloudinary');
// NOT DONE

const Artwork = require('../app/models/artwork');
const Photo = require('../app/models/photo');
const Gallery = require('../app/models/gallery');
const Artist = require('../app/models/artist');

const relations = require('./relations');

// Returns normalized list of JSON objects ready for Mongoose
const fetchGallery = (cloudName, tagName) => {
  const url = `https://res.cloudinary.com/${cloudName}/image/list/${tagName}.json`;
  return axios(url)
    .then(res => res.data.resources.map(json => {
      return hydrateResource(json);
    }))
}

const customValues = {
  caption: '',
  alt: '',
  completed: '2000-01-01',
  medium: '',
  size: '1" x 1"',
  geotag: '0,0',
  location: '',
  key: '',
  original: '',
  price: 0,
  ref: ''
};

const hydrateResource = function (json) {
  const resource = Object.assign({}, json);
  if (json.context) {
    Object.keys(customValues).forEach(k => {
      resource.context.custom[k] = json.context.custom[k] || customValues[k];
    })
  } else {
    resource.context = { customValues }
  }

  const fldr = resource.public_id.split('/')[0];
  let resType = '';
  switch (fldr) {
    case 'art':
    case 'nfs':
      resType = 'art';
      break;
    case 'photos':
      resType = 'photo';
      break;
    default:
      resType = 'asset';
  }
  resource.resourceType = resType;
  return resource;
}

/**
 * takes JSON resource from Cloudinary
 * @param {Object} resource 
 */
const convertResource = function (resource, galleryTag = '') {
  switch (resource.resourceType) {
    case 'art':
      return cloudinaryToArtwork(resource, galleryTag);
    case 'photo':
      return cloudinaryToPhoto(resource);
    default:
      return resource;
  }
};

/**
 * takes size as '12" x 9"', returns obj
 * @param {String} sizeStr 
 */
const getDimensions = sizeStr => {
  const sizeParams = sizeStr.split('x');
  const w = parseInt(sizeParams[0].trim());
  const h = parseInt(sizeParams[1].trim());
  return {
    width: w,
    height: h,
    depth: 1,
    units: 'inches'
  };
};

const getLocation = resCustom => {
  const geo = resCustom.geotag.split(',');
  return {
    name: resCustom.location,
    geolat: geo[0],
    geolng: geo[1]
  }
};

const getDefaultArtist = async () => {
  const artist = await Artist.findOne({ name: 'Charlie Kelly' });
  return artist;
}

/**
 * create Artwork from fetched JSON
 * if fetched from gallery, add Tag
 * if exists, update with Tag
 * @param {JSON} resource 
 */
const cloudinaryToArtwork = (resource, galleryTag = '') => {
  const id = resource.public_id.split('/');
  const gallery = galleryTag ? Gallery.findOne({ tag: galleryTag }) : null;
  let artwork = Artwork.findOne({ cloudId: id[1] });
  if (artwork) {
    if (gallery) relations.addGalleryToArtwork(artwork._id, gallery);
  } else {
    artwork = Artwork.create({
      cloudId: id[1],
      cloudFolder: id[0],
      title: resource.context.custom.caption,
      description: resource.context.custom.alt,
      medium: resource.context.custom.medium,
      completed: resource.context.custom.completed,
      dimensions: getDimensions(resource.context.custom.size),
      location: getLocation(resource.context.custom),
      artist: getDefaultArtist()._id
    })
    if (gallery) {
      relations.addGalleryToArtwork(artwork._id, gallery);
    }
    if (resource.context.custom.original) {
      const avail = resource.context.custom.original === 'available';
      const price = resource.context.custom.price;
      if (avail) relations.addOriginalProduct(artwork._id, price);
    }
  }
  return artwork;
};

/**
 * 
 * @param {JSON} resource 
 */
const cloudinaryToPhoto = resource => {
  const id = resource.public_id.split('/');
  let photo = Photo.findOne({ cloudId: id[1] });
  if (!photo) {
    const nameParts = id[1].split('-');
    const artworkId = nameParts[1];
    const order = nameParts[2];
    photo = Photo.create({
      cloudId: id,
      cloudFolder: resource.public_id.split('/')[0],
      series: artworkId,
      sequence: isNaN(order) ? 100 : order,
      isFinal: nameParts[2] === 'final',
      artwork: Artwork.findOne({ cloudId: artworkId }).then(artwork => artwork._id)
    })
  }
  return photo;
};

module.exports = {
  fetchGallery,
  convertResource,
  cloudinaryToArtwork,
  cloudinaryToPhoto
}
